package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.domain.ChatMessage;
import com.yorku4413s25.leafwheels.domain.ChatSession;
import com.yorku4413s25.leafwheels.domain.User;
import com.yorku4413s25.leafwheels.repositories.ChatMessageRepository;
import com.yorku4413s25.leafwheels.repositories.ChatSessionRepository;
import com.yorku4413s25.leafwheels.repositories.UserRepository;
import com.yorku4413s25.leafwheels.web.models.AnalyticsEventDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class ChatService {

    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final ContentFilterService contentFilterService;
    private final AnalyticsService analyticsService;
    private final LexService lexService;
    private final ChatIntentHandlerService intentHandlerService;
    
    @Value("${chatbot.max-session-duration:3600000}")
    private long maxSessionDuration;
    
    @Value("${chatbot.max-message-length:1000}")
    private int maxMessageLength;
    
    public ChatResponse sendMessage(String sessionId, String message, String username) {
        if (message == null || message.trim().isEmpty()) {
            return new ChatResponse("Please provide a message.", null, false);
        }
        
        if (message.length() > maxMessageLength) {
            return new ChatResponse("Message too long. Please keep it under " + maxMessageLength + " characters.", null, false);
        }

        ContentFilterService.FilterResult filterResult = contentFilterService.filterContent(message);
        if (!filterResult.isAllowed()) {
            return new ChatResponse("Sorry, your message contains inappropriate content. Please rephrase.", null, false);
        }

        ChatSession session = getOrCreateSession(sessionId, username);

        ChatMessage userMessage = new ChatMessage();
        userMessage.setChatSession(session);
        userMessage.setMessageContent(message);
        userMessage.setIsFromUser(true);
        userMessage.setMessageType(ChatMessage.MessageType.TEXT);
        userMessage.setTimestamp(java.time.Instant.now());
        chatMessageRepository.save(userMessage);
        
        try {
            // PRIMARY: Use AWS Lex for natural language understanding and intent recognition
            String botResponse;
            String detectedIntent;
            
            if (lexService.isServiceAvailable()) {
                    Map<String, String> sessionAttributes = getConversationContextForLex(session);
                
                // AWS Lex processes natural language and extracts intent + slots
                LexService.LexResponse lexResponse = lexService.sendMessage(message, sessionId, username, sessionAttributes);
                
                Map<String, String> enrichedSlots = new HashMap<>(lexResponse.getSlots());
                enrichedSlots.put("originalMessage", message); // Add original message for fallback detection
                botResponse = intentHandlerService.handleIntent(lexResponse.getIntent(), enrichedSlots, username);
                detectedIntent = lexResponse.getIntent() != null ? lexResponse.getIntent() : "unknown";
                
            } else {
                // FALLBACK: Only basic intents when Lex is completely unavailable
                detectedIntent = detectBasicIntent(message);
                botResponse = intentHandlerService.handleIntent(detectedIntent, new HashMap<>(), username);
            }

            ChatMessage botMessage = new ChatMessage();
            botMessage.setChatSession(session);
            botMessage.setMessageContent(botResponse);
            botMessage.setIsFromUser(false);
            botMessage.setIntent(detectedIntent);
            botMessage.setMessageType(ChatMessage.MessageType.TEXT);
            botMessage.setTimestamp(java.time.Instant.now());
            chatMessageRepository.save(botMessage);

            trackChatInteraction(username, detectedIntent, message, botResponse);
            
            return new ChatResponse(botResponse, detectedIntent, false);
            
        } catch (Exception e) {
            ChatMessage errorMessage = new ChatMessage();
            errorMessage.setChatSession(session);
            errorMessage.setMessageContent("I'm sorry, I encountered an error. Please try again.");
            errorMessage.setIsFromUser(false);
            errorMessage.setMessageType(ChatMessage.MessageType.ERROR);
            errorMessage.setTimestamp(java.time.Instant.now());
            chatMessageRepository.save(errorMessage);
            
            return new ChatResponse("I'm sorry, I encountered an error. Please try again.", null, false);
        }
    }
    
    public String startNewSession(String username) {
        String sessionId = UUID.randomUUID().toString();
        getOrCreateSession(sessionId, username);
        trackSessionEvent(username, "session_started", sessionId);
        return sessionId;
    }
    
    public void endSession(String sessionId) {
        Optional<ChatSession> sessionOpt = chatSessionRepository.findBySessionId(sessionId);
        if (sessionOpt.isPresent()) {
            ChatSession session = sessionOpt.get();
            String username = session.getUser() != null ? session.getUser().getEmail() : null;
            session.setIsActive(false);
            chatSessionRepository.save(session);
            trackSessionEvent(username, "session_ended", sessionId);
        }
    }
    
    public List<ChatMessage> getSessionHistory(String sessionId) {
        Optional<ChatSession> sessionOpt = chatSessionRepository.findBySessionId(sessionId);
        if (sessionOpt.isPresent()) {
            return chatMessageRepository.findByChatSessionOrderByCreatedAtAsc(sessionOpt.get());
        }
        return List.of();
    }
    
    public Page<ChatSession> getUserSessions(String username, Pageable pageable) {
        Optional<User> userOpt = userRepository.findByEmail(username);
        if (userOpt.isPresent()) {
            return chatSessionRepository.findByUserOrderByCreatedAtDesc(userOpt.get(), pageable);
        }
        return Page.empty();
    }
    
    @Scheduled(fixedRate = 300000)
    public void cleanupInactiveSessions() {
        Instant cutoffTime = Instant.now().minusMillis(maxSessionDuration);
        int deactivatedCount = chatSessionRepository.deactivateInactiveSessions(cutoffTime);
    }
    
    private ChatSession getOrCreateSession(String sessionId, String username) {
        Optional<ChatSession> existingSession = chatSessionRepository.findBySessionId(sessionId);
        
        if (existingSession.isPresent()) {
            ChatSession session = existingSession.get();
            return chatSessionRepository.save(session);
        }

        ChatSession newSession = new ChatSession();
        newSession.setSessionId(sessionId);
        
        if (username != null) {
            Optional<User> userOpt = userRepository.findByEmail(username);
            userOpt.ifPresent(newSession::setUser);
        }
        
        return chatSessionRepository.save(newSession);
    }
    
    private Map<String, String> getConversationContextForLex(ChatSession session) {
        Map<String, String> sessionAttributes = new HashMap<>();
        
        Page<ChatMessage> recentMessagesPage = chatMessageRepository.findByChatSessionOrderByCreatedAtDesc(session, 
                PageRequest.of(0, 2)); // Get last 2 messages for context
        List<ChatMessage> recentMessages = recentMessagesPage.getContent();
        
        if (!recentMessages.isEmpty()) {
            ChatMessage lastMessage = recentMessages.get(0);
            if (lastMessage.getIntent() != null) {
                sessionAttributes.put("lastIntent", lastMessage.getIntent());
            }
            sessionAttributes.put("lastMessage", lastMessage.getMessageContent());
            sessionAttributes.put("username", session.getUser() != null ? session.getUser().getEmail() : "anonymous");
        }
        
        return sessionAttributes;
    }
    
    private String detectBasicIntent(String message) {
        String lowerMessage = message.toLowerCase().trim();
        
        if (lowerMessage.matches(".*(hello|hi|hey|good morning|good afternoon|good evening).*")) return "greeting";
        if (lowerMessage.matches(".*(help|what can you do|capabilities).*")) return "help";
        if (lowerMessage.matches(".*(bye|goodbye|thank you|thanks).*")) return "goodbye";
        
        if (lowerMessage.matches(".*(find|search|show|looking for).*(tesla|nissan|chevrolet|ford|audi|bmw|hyundai|kia|volkswagen|porsche|jaguar|rivian|lucid|mercedes|benz|volvo|polestar|toyota|mazda|alfa|romeo|gmc|land|rover|ram|dodge|mitsubishi|mini|subaru|acura|infiniti|lexus|genesis|cadillac).*")) return "searchvehicles";
        if (lowerMessage.matches(".*(what|do you have|have any).*(models|vehicles|cars).*")) return "searchvehicles";
        if (lowerMessage.matches(".*(tesla|nissan|chevrolet|ford|audi|bmw|hyundai|kia|volkswagen|porsche|jaguar|rivian|lucid|mercedes|benz|volvo|polestar|toyota|mazda|alfa|romeo|gmc|land|rover|ram|dodge|mitsubishi|mini|subaru|acura|infiniti|lexus|genesis|cadillac).*(vehicles|cars|models).*")) return "searchvehicles";
        if (lowerMessage.matches(".*(price|cost|pricing).*(of|for).*(tesla|nissan|chevrolet|ford|audi|bmw|hyundai|kia|volkswagen|porsche|jaguar|rivian|lucid|mercedes|benz|volvo|polestar|toyota|mazda|alfa|romeo|gmc|land|rover|ram|dodge|mitsubishi|mini|subaru|acura|infiniti|lexus|genesis|cadillac).*")) return "searchvehicles";
        
        if (lowerMessage.matches("^(cart|my cart|view cart|shopping cart)$")) return "viewcart";
        if (lowerMessage.matches(".*(what.*in.*cart|cart.*content|show.*cart).*")) return "viewcart";
        if (lowerMessage.matches(".*(order|orders|order history|my orders|purchase history).*")) return "vieworders";
        
        if (lowerMessage.matches(".*(loan|finance|financing|payment|monthly payment|calculate).*")) return "loancalculation";
        
        if (lowerMessage.matches(".*(accessory|accessories|parts|equipment).*")) return "searchaccessories";
        
        return "general_conversation";
    }
    
    private void trackChatInteraction(String username, String intent, String userMessage, String botResponse) {
        try {
            AnalyticsEventDto event = new AnalyticsEventDto();
            event.setEvent("chat_interaction");
            
            Map<String, Object> properties = new HashMap<>();
            properties.put("user", username != null ? username : "anonymous");
            properties.put("intent", intent != null ? intent : "unknown");
            properties.put("user_message_length", userMessage.length());
            properties.put("bot_response_length", botResponse.length());
            properties.put("timestamp", Instant.now().toString());
            properties.put("has_intent", intent != null && !intent.equals("Fallback"));
            
            event.setProperties(properties);
            
            analyticsService.processEvent(event);
            
        } catch (Exception e) {
            System.err.println("Error tracking chat analytics: " + e.getMessage());
        }
    }
    
    private void trackSessionEvent(String username, String event, String sessionId) {
        try {
            AnalyticsEventDto analyticsEvent = new AnalyticsEventDto();
            analyticsEvent.setEvent("chat_" + event);
            
            Map<String, Object> properties = new HashMap<>();
            properties.put("user", username != null ? username : "anonymous");
            properties.put("session_id", sessionId);
            properties.put("timestamp", Instant.now().toString());
            
            analyticsEvent.setProperties(properties);
            
            analyticsService.processEvent(analyticsEvent);
            
        } catch (Exception e) {
            System.err.println("Error tracking session analytics: " + e.getMessage());
        }
    }
    
    public static class ChatResponse {
        private final String message;
        private final String intent;
        private final boolean conversationComplete;
        
        public ChatResponse(String message, String intent, boolean conversationComplete) {
            this.message = message;
            this.intent = intent;
            this.conversationComplete = conversationComplete;
        }
        
        public String getMessage() { return message; }
        public String getIntent() { return intent; }
        public boolean isConversationComplete() { return conversationComplete; }
    }
}
