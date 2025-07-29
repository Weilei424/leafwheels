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
    private final LexService lexService;
    private final ContentFilterService contentFilterService;
    private final ChatIntentHandlerService intentHandlerService;
    private final AnalyticsService analyticsService;
    
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
        chatMessageRepository.save(userMessage);
        
        try {
            Map<String, String> sessionAttributes = buildSessionAttributes(session);

            LexService.LexResponse lexResponse = lexService.sendMessage(message, sessionId, username, sessionAttributes);

            String enhancedResponse = lexResponse.getMessage();
            if (lexResponse.getIntent() != null && !lexResponse.getIntent().equals("Fallback")) {
                try {
                    String intentResponse = intentHandlerService.handleIntent(
                        lexResponse.getIntent(), 
                        lexResponse.getSlots(), 
                        username
                    );

                    if (intentResponse != null && intentResponse.length() > enhancedResponse.length()) {
                        enhancedResponse = intentResponse;
                    }
                } catch (Exception e) {
                    System.err.println("Error handling intent: " + e.getMessage());
                }
            }

            ChatMessage botMessage = new ChatMessage();
            botMessage.setChatSession(session);
            botMessage.setMessageContent(enhancedResponse);
            botMessage.setIsFromUser(false);
            botMessage.setIntent(lexResponse.getIntent());
            botMessage.setMessageType(ChatMessage.MessageType.INTENT_RESPONSE);
            botMessage.setMetadata(buildMetadata(lexResponse));
            chatMessageRepository.save(botMessage);

            updateSessionContext(session, lexResponse);

            trackChatInteraction(username, lexResponse.getIntent(), message, enhancedResponse);
            
            return new ChatResponse(enhancedResponse, lexResponse.getIntent(), lexResponse.isComplete());
            
        } catch (Exception e) {
            ChatMessage errorMessage = new ChatMessage();
            errorMessage.setChatSession(session);
            errorMessage.setMessageContent("I'm sorry, I encountered an error. Please try again.");
            errorMessage.setIsFromUser(false);
            errorMessage.setMessageType(ChatMessage.MessageType.ERROR);
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
            lexService.endSession(sessionId);
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
        if (deactivatedCount > 0) {
            System.out.println("Deactivated " + deactivatedCount + " inactive chat sessions");
        }
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
    
    private Map<String, String> buildSessionAttributes(ChatSession session) {
        Map<String, String> attributes = new HashMap<>();
        
        if (session.getUser() != null) {
            attributes.put("userId", session.getUser().getId().toString());
            attributes.put("userEmail", session.getUser().getEmail());
        }
        
        if (session.getContext() != null) {
            attributes.put("context", session.getContext());
        }
        
        return attributes;
    }
    
    private String buildMetadata(LexService.LexResponse lexResponse) {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("intent", lexResponse.getIntent());
        metadata.put("slots", lexResponse.getSlots());
        metadata.put("dialogAction", lexResponse.getDialogAction());
        metadata.put("sessionAttributes", lexResponse.getSessionAttributes());

        return metadata.toString();
    }
    
    private void updateSessionContext(ChatSession session, LexService.LexResponse lexResponse) {
        if (lexResponse.getSessionAttributes() != null && !lexResponse.getSessionAttributes().isEmpty()) {
            session.setContext(lexResponse.getSessionAttributes().toString());
            chatSessionRepository.save(session);
        }
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
