package com.yorku4413s25.leafwheels.web.controllers;

import com.yorku4413s25.leafwheels.services.LexBotSetupService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/lex")
@Tag(name = "Lex Bot Management", description = "Administrative endpoints for managing Lex bot configuration")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class LexBotManagementController {

    private final LexBotSetupService lexBotSetupService;

    @PostMapping("/setup")
    @Operation(summary = "Setup bot components (intents, slot types, slots)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> setupBot() {
        try {
            lexBotSetupService.setupBotComponents();
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Bot components setup initiated successfully");
            response.put("status", "success");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to setup bot components: " + e.getMessage());
            response.put("status", "error");
            
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/build")
    @Operation(summary = "Build the bot locale")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> buildBot() {
        try {
            lexBotSetupService.buildBot();
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Bot build initiated successfully");
            response.put("status", "success");
            response.put("note", "Building may take a few minutes. Check AWS Console for build status.");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to build bot: " + e.getMessage());
            response.put("status", "error");
            
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/status")
    @Operation(summary = "Get bot setup status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getBotStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Bot status check not implemented yet");
        response.put("status", "info");
        response.put("note", "Check AWS Lex Console for detailed bot status");
        
        return ResponseEntity.ok(response);
    }
}