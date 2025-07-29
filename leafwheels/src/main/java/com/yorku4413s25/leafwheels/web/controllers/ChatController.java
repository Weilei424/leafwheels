package com.yorku4413s25.leafwheels.web.controllers;

import com.yorku4413s25.leafwheels.domain.ChatMessage;
import com.yorku4413s25.leafwheels.domain.ChatSession;
import com.yorku4413s25.leafwheels.services.ChatService;
import com.yorku4413s25.leafwheels.web.models.ChatMessageDto;
import com.yorku4413s25.leafwheels.web.models.ChatRequestDto;
import com.yorku4413s25.leafwheels.web.models.ChatResponseDto;
import com.yorku4413s25.leafwheels.web.models.ChatSessionDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/chat")
@Tag(name = "Chat", description = "Chat and AI assistant endpoints")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    
    @PostMapping("/start")
    @Operation(summary = "Start a new chat session")
    public ResponseEntity<Map<String, String>> startSession(Authentication authentication) {
        String username = authentication != null ? authentication.getName() : null;
        String sessionId = chatService.startNewSession(username);
        
        Map<String, String> response = new HashMap<>();
        response.put("sessionId", sessionId);
        response.put("message", "Chat session started successfully");
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/message")
    @Operation(summary = "Send a message to the chatbot")
    public ResponseEntity<ChatResponseDto> sendMessage(
            @Valid @RequestBody ChatRequestDto request,
            Authentication authentication) {
        
        String username = authentication != null ? authentication.getName() : null;
        
        ChatService.ChatResponse response = chatService.sendMessage(
                request.getSessionId(),
                request.getMessage(),
                username
        );
        
        ChatResponseDto responseDto = new ChatResponseDto();
        responseDto.setMessage(response.getMessage());
        responseDto.setIntent(response.getIntent());
        responseDto.setConversationComplete(response.isConversationComplete());
        responseDto.setTimestamp(java.time.Instant.now());
        
        return ResponseEntity.ok(responseDto);
    }
    
    @DeleteMapping("/session/{sessionId}")
    @Operation(summary = "End a chat session")
    public ResponseEntity<Map<String, String>> endSession(
            @Parameter(description = "Session ID") @PathVariable String sessionId,
            Authentication authentication) {
        
        chatService.endSession(sessionId);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Chat session ended successfully");
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/session/{sessionId}/history")
    @Operation(summary = "Get chat history for a session")
    public ResponseEntity<List<ChatMessageDto>> getSessionHistory(
            @Parameter(description = "Session ID") @PathVariable String sessionId,
            Authentication authentication) {
        
        List<ChatMessage> messages = chatService.getSessionHistory(sessionId);
        
        List<ChatMessageDto> messageDtos = messages.stream()
                .map(this::convertToMessageDto)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(messageDtos);
    }
    
    @GetMapping("/sessions")
    @Operation(summary = "Get user's chat sessions")
    public ResponseEntity<Page<ChatSessionDto>> getUserSessions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
        
        if (authentication == null) {
            return ResponseEntity.ok(Page.empty());
        }
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ChatSession> sessions = chatService.getUserSessions(authentication.getName(), pageable);
        
        Page<ChatSessionDto> sessionDtos = sessions.map(this::convertToSessionDto);
        
        return ResponseEntity.ok(sessionDtos);
    }
    
    @GetMapping("/health")
    @Operation(summary = "Check chat service health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "Chat Service");
        health.put("timestamp", java.time.Instant.now());
        
        return ResponseEntity.ok(health);
    }
    
    private ChatMessageDto convertToMessageDto(ChatMessage message) {
        ChatMessageDto dto = new ChatMessageDto();
        dto.setId(message.getId());
        dto.setContent(message.getMessageContent());
        dto.setFromUser(message.getIsFromUser());
        dto.setIntent(message.getIntent());
        dto.setCreatedAt(message.getCreatedAt());
        dto.setMessageType(message.getMessageType().toString());
        return dto;
    }
    
    private ChatSessionDto convertToSessionDto(ChatSession session) {
        ChatSessionDto dto = new ChatSessionDto();
        dto.setId(session.getId());
        dto.setSessionId(session.getSessionId());
        dto.setCreatedAt(session.getCreatedAt());
        dto.setUpdatedAt(session.getUpdatedAt());
        dto.setActive(session.getIsActive());
        dto.setMessageCount(session.getMessages().size());
        return dto;
    }
}
