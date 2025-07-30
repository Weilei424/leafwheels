package com.yorku4413s25.leafwheels.web.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ChatSessionDto {
    
    private Long id;
    private String sessionId;
    private Instant createdAt;
    private Instant updatedAt;
    private boolean active;
    private int messageCount;
}