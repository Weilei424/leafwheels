package com.yorku4413s25.leafwheels.web.controllers;

import com.yorku4413s25.leafwheels.services.ChatService;
import com.yorku4413s25.leafwheels.services.RateLimitService;
import com.yorku4413s25.leafwheels.web.models.ChatRequestDto;
import com.yorku4413s25.leafwheels.web.models.ChatResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final ChatService chatService;
    private final RateLimitService rateLimitService;
    private final SimpMessagingTemplate messagingTemplate;
    
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatRequestDto chatRequest, 
                           SimpMessageHeaderAccessor headerAccessor,
                           Principal principal) {
        
        String username = principal != null ? principal.getName() : null;
        String webSocketSessionId = headerAccessor.getSessionId();

        if (!rateLimitService.isAllowed(username, getClientIP(headerAccessor))) {
            ChatResponseDto errorResponse = new ChatResponseDto();
            errorResponse.setMessage("Rate limit exceeded. Please slow down.");
            errorResponse.setConversationComplete(false);
            errorResponse.setTimestamp(Instant.now());
            
            if (principal != null) {
                messagingTemplate.convertAndSendToUser(
                    principal.getName(),
                    "/queue/chat", 
                    errorResponse
                );
            } else {
                messagingTemplate.convertAndSendToUser(
                    webSocketSessionId, 
                    "/queue/chat", 
                    errorResponse
                );
            }
            return;
        }
        
        try {
            ChatService.ChatResponse response = chatService.sendMessage(
                chatRequest.getSessionId(),
                chatRequest.getMessage(),
                username
            );

            ChatResponseDto responseDto = new ChatResponseDto();
            responseDto.setMessage(response.getMessage());
            responseDto.setIntent(response.getIntent());
            responseDto.setConversationComplete(response.isConversationComplete());
            responseDto.setTimestamp(Instant.now());

            if (principal != null) {
                messagingTemplate.convertAndSendToUser(
                    principal.getName(),
                    "/queue/chat",
                    responseDto
                );
            } else {
                messagingTemplate.convertAndSendToUser(
                    webSocketSessionId,
                    "/queue/chat",
                    responseDto
                );
            }
            
        } catch (Exception e) {
            ChatResponseDto errorResponse = new ChatResponseDto();
            errorResponse.setMessage("Sorry, I encountered an error processing your message.");
            errorResponse.setConversationComplete(false);
            errorResponse.setTimestamp(Instant.now());
            
            if (principal != null) {
                messagingTemplate.convertAndSendToUser(
                    principal.getName(),
                    "/queue/chat",
                    errorResponse
                );
            } else {
                messagingTemplate.convertAndSendToUser(
                    webSocketSessionId,
                    "/queue/chat",
                    errorResponse
                );
            }
        }
    }
    
    @MessageMapping("/chat.startSession")
    public void startSession(SimpMessageHeaderAccessor headerAccessor, Principal principal) {
        String username = principal != null ? principal.getName() : null;
        String webSocketSessionId = headerAccessor.getSessionId();
        
        
        String sessionId = chatService.startNewSession(username);
        
        Map<String, String> response = new HashMap<>();
        response.put("sessionId", sessionId);
        response.put("message", "Chat session started successfully");
        response.put("timestamp", Instant.now().toString());
        
        
        if (principal != null) {
            messagingTemplate.convertAndSendToUser(
                principal.getName(),
                "/queue/session",
                response
            );
        } else {
            // Fallback for unauthenticated users
            messagingTemplate.convertAndSendToUser(
                webSocketSessionId,
                "/queue/session",
                response
            );
        }
    }
    
    @MessageMapping("/chat.endSession")
    public void endSession(@Payload Map<String, String> payload,
                          SimpMessageHeaderAccessor headerAccessor,
                          Principal principal) {
        
        String sessionId = payload.get("sessionId");
        if (sessionId != null) {
            chatService.endSession(sessionId);
        }
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Chat session ended successfully");
        response.put("timestamp", Instant.now().toString());
        
        if (principal != null) {
            messagingTemplate.convertAndSendToUser(
                principal.getName(),
                "/queue/session",
                response
            );
        } else {
            // Fallback for unauthenticated users
            messagingTemplate.convertAndSendToUser(
                headerAccessor.getSessionId(),
                "/queue/session",
                response
            );
        }
    }
    
    // WebSocket endpoint for typing indicators - available for frontend integration
    @MessageMapping("/chat.typing")
    @SendTo("/topic/typing")
    public Map<String, Object> handleTypingIndicator(@Payload Map<String, Object> payload,
                                                    Principal principal) {
        
        Map<String, Object> response = new HashMap<>();
        response.put("user", principal != null ? principal.getName() : "Anonymous");
        response.put("typing", payload.get("typing"));
        response.put("sessionId", payload.get("sessionId"));
        response.put("timestamp", Instant.now());
        
        return response;
    }
    
    private String getClientIP(SimpMessageHeaderAccessor headerAccessor) {
        Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
        if (sessionAttributes != null) {
            Object ip = sessionAttributes.get("IP_ADDRESS");
            if (ip != null) {
                return ip.toString();
            }
        }

        return headerAccessor.getSessionId();
    }
}
