package com.yorku4413s25.leafwheels.services;

import java.util.Map;

public interface LexService {

    LexResponse sendMessage(String message, String sessionId, String userId);
    LexResponse sendMessage(String message, String sessionId, String userId, Map<String, String> sessionAttributes);
    void endSession(String sessionId);
    boolean isServiceAvailable();
    public static class LexResponse {
        private String message;
        private String intent;
        private Map<String, String> slots;
        private Map<String, String> sessionAttributes;
        private String dialogAction;
        private boolean isComplete;
        
        public LexResponse() {}
        
        public LexResponse(String message, String intent, Map<String, String> slots, 
                          Map<String, String> sessionAttributes, String dialogAction, boolean isComplete) {
            this.message = message;
            this.intent = intent;
            this.slots = slots;
            this.sessionAttributes = sessionAttributes;
            this.dialogAction = dialogAction;
            this.isComplete = isComplete;
        }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        
        public String getIntent() { return intent; }
        public void setIntent(String intent) { this.intent = intent; }
        
        public Map<String, String> getSlots() { return slots; }
        public void setSlots(Map<String, String> slots) { this.slots = slots; }
        
        public Map<String, String> getSessionAttributes() { return sessionAttributes; }
        public void setSessionAttributes(Map<String, String> sessionAttributes) { this.sessionAttributes = sessionAttributes; }
        
        public String getDialogAction() { return dialogAction; }
        public void setDialogAction(String dialogAction) { this.dialogAction = dialogAction; }
        
        public boolean isComplete() { return isComplete; }
        public void setComplete(boolean complete) { isComplete = complete; }
    }
}
