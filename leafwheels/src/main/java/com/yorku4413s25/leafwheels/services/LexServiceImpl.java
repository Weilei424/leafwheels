package com.yorku4413s25.leafwheels.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.lexruntimev2.LexRuntimeV2Client;
import software.amazon.awssdk.services.lexruntimev2.model.*;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class LexServiceImpl implements LexService {
    
    @Value("${aws.lex.bot-id}")
    private String botId;
    
    @Value("${aws.lex.bot-alias-id}")
    private String botAliasId;
    
    @Value("${aws.lex.locale-id}")
    private String localeId;
    
    @Value("${aws.region}")
    private String region;
    
    @Value("${aws.access-key-id}")
    private String accessKeyId;
    
    @Value("${aws.secret-access-key}")
    private String secretAccessKey;
    
    private LexRuntimeV2Client lexClient;
    
    @PostConstruct
    public void init() {
        if (accessKeyId != null && !accessKeyId.isEmpty() && 
            secretAccessKey != null && !secretAccessKey.isEmpty()) {
            
            AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(accessKeyId, secretAccessKey);
            
            this.lexClient = LexRuntimeV2Client.builder()
                    .region(Region.of(region))
                    .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                    .build();
        }
    }
    
    @PreDestroy
    public void cleanup() {
        if (lexClient != null) {
            lexClient.close();
        }
    }
    
    @Override
    public LexResponse sendMessage(String message, String sessionId, String userId) {
        return sendMessage(message, sessionId, userId, new HashMap<>());
    }
    
    @Override
    public LexResponse sendMessage(String message, String sessionId, String userId, Map<String, String> sessionAttributes) {
        if (!isServiceAvailable()) {
            return createFallbackResponse("I'm sorry, the chat service is currently unavailable. Please try again later.");
        }
        
        try {
            RecognizeTextRequest.Builder requestBuilder = RecognizeTextRequest.builder()
                    .botId(botId)
                    .botAliasId(botAliasId)
                    .localeId(localeId)
                    .sessionId(sessionId)
                    .text(message);
            
            if (sessionAttributes != null && !sessionAttributes.isEmpty()) {
                requestBuilder.sessionState(SessionState.builder()
                        .sessionAttributes(sessionAttributes)
                        .build());
            }
            
            RecognizeTextResponse response = lexClient.recognizeText(requestBuilder.build());
            
            return mapToLexResponse(response);
            
        } catch (Exception e) {
            System.err.println("Error communicating with AWS Lex: " + e.getMessage());
            return createFallbackResponse("I'm sorry, I encountered an error processing your request. Please try again.");
        }
    }
    
    @Override
    public void endSession(String sessionId) {
    }
    
    @Override
    public boolean isServiceAvailable() {
        return lexClient != null && 
               botId != null && !botId.isEmpty() &&
               botAliasId != null && !botAliasId.isEmpty();
    }
    
    private LexResponse mapToLexResponse(RecognizeTextResponse response) {
        String message = "";
        if (response.messages() != null && !response.messages().isEmpty()) {
            message = response.messages().get(0).content();
        }
        
        String intent = "";
        Map<String, String> slots = new HashMap<>();
        
        if (response.sessionState() != null && response.sessionState().intent() != null) {
            Intent intentObj = response.sessionState().intent();
            intent = intentObj.name();
            
            if (intentObj.slots() != null) {
                slots = intentObj.slots().entrySet().stream()
                        .collect(Collectors.toMap(
                                Map.Entry::getKey,
                                entry -> entry.getValue() != null && entry.getValue().value() != null 
                                        ? entry.getValue().value().interpretedValue() 
                                        : ""
                        ));
            }
        }
        
        Map<String, String> sessionAttributes = new HashMap<>();
        if (response.sessionState() != null && response.sessionState().sessionAttributes() != null) {
            sessionAttributes = response.sessionState().sessionAttributes();
        }
        
        String dialogAction = response.sessionState() != null 
                ? response.sessionState().dialogAction().type().toString()
                : "ElicitIntent";
        
        boolean isComplete = "Close".equals(dialogAction) || "ConfirmIntent".equals(dialogAction);
        
        return new LexResponse(message, intent, slots, sessionAttributes, dialogAction, isComplete);
    }
    
    private LexResponse createFallbackResponse(String message) {
        return new LexResponse(message, "Fallback", new HashMap<>(), new HashMap<>(), "ElicitIntent", false);
    }
}
