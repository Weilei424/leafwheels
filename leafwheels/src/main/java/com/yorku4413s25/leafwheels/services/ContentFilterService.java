package com.yorku4413s25.leafwheels.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;

@Service
public class ContentFilterService {
    
    @Value("${content-filter.enabled:true}")
    private boolean filterEnabled;
    
    @Value("${content-filter.whitelist-file:classpath:chat-allowlist.txt}")
    private String whitelistFile;
    
    @Value("${content-filter.blacklist-file:classpath:chat-blocklist.txt}")
    private String blacklistFile;
    
    private final ResourceLoader resourceLoader;
    
    private Set<String> whitelist = new HashSet<>();
    private Set<String> blacklist = new HashSet<>();
    private Set<Pattern> blacklistPatterns = new HashSet<>();
    
    public ContentFilterService(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }
    
    @PostConstruct
    public void init() {
        if (filterEnabled) {
            loadWhitelist();
            loadBlacklist();
        }
    }
    
    public FilterResult filterContent(String content) {
        if (!filterEnabled) {
            return new FilterResult(true, content, null);
        }
        
        if (content == null || content.trim().isEmpty()) {
            return new FilterResult(false, content, "Empty or null content");
        }
        
        String normalizedContent = content.toLowerCase().trim();

        for (String blacklistedWord : blacklist) {
            if (normalizedContent.contains(blacklistedWord.toLowerCase())) {
                return new FilterResult(false, content, "Content contains prohibited word: " + blacklistedWord);
            }
        }

        for (Pattern pattern : blacklistPatterns) {
            if (pattern.matcher(normalizedContent).find()) {
                return new FilterResult(false, content, "Content matches prohibited pattern");
            }
        }

        if (!whitelist.isEmpty()) {
            boolean hasWhitelistedTerm = false;
            for (String whitelistedWord : whitelist) {
                if (normalizedContent.contains(whitelistedWord.toLowerCase())) {
                    hasWhitelistedTerm = true;
                    break;
                }
            }
            
            if (!hasWhitelistedTerm) {
                return new FilterResult(false, content, "Content does not contain any whitelisted terms");
            }
        }
        
        return new FilterResult(true, content, null);
    }
    
    public String sanitizeContent(String content) {
        if (!filterEnabled || content == null) {
            return content;
        }
        
        String sanitized = content;

        sanitized = sanitized.replaceAll("[<>\"'&]", "");

        for (String blacklistedWord : blacklist) {
            String replacement = "*".repeat(blacklistedWord.length());
            sanitized = sanitized.replaceAll("(?i)" + Pattern.quote(blacklistedWord), replacement);
        }
        
        return sanitized.trim();
    }
    
    public boolean isContentAllowed(String content) {
        return filterContent(content).isAllowed();
    }
    
    public void addToWhitelist(String word) {
        if (word != null && !word.trim().isEmpty()) {
            whitelist.add(word.trim().toLowerCase());
        }
    }
    
    public void addToBlacklist(String word) {
        if (word != null && !word.trim().isEmpty()) {
            blacklist.add(word.trim().toLowerCase());
        }
    }
    
    public void removeFromWhitelist(String word) {
        if (word != null) {
            whitelist.remove(word.trim().toLowerCase());
        }
    }
    
    public void removeFromBlacklist(String word) {
        if (word != null) {
            blacklist.remove(word.trim().toLowerCase());
        }
    }
    
    private void loadWhitelist() {
        try {
            Resource resource = resourceLoader.getResource(whitelistFile);
            if (resource.exists()) {
                loadWordsFromResource(resource, whitelist);
            }
        } catch (Exception e) {
            System.out.println("Warning: Could not load whitelist file: " + e.getMessage());
        }
    }
    
    private void loadBlacklist() {
        try {
            Resource resource = resourceLoader.getResource(blacklistFile);
            if (resource.exists()) {
                loadWordsFromResource(resource, blacklist);
                createBlacklistPatterns();
            } else {
                loadDefaultBlacklist();
            }
        } catch (Exception e) {
            System.out.println("Warning: Could not load blacklist file, using defaults: " + e.getMessage());
            loadDefaultBlacklist();
        }
    }
    
    private void loadWordsFromResource(Resource resource, Set<String> targetSet) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (!line.isEmpty() && !line.startsWith("#")) {
                    targetSet.add(line.toLowerCase());
                }
            }
        }
    }
    
    private void createBlacklistPatterns() {
        for (String word : blacklist) {
            String patternStr = "\\b" + Pattern.quote(word) + "\\b";
            blacklistPatterns.add(Pattern.compile(patternStr, Pattern.CASE_INSENSITIVE));
        }
    }
    
    private void loadDefaultBlacklist() {
        blacklist.add("spam");
        blacklist.add("abuse");
        blacklist.add("hack");
        blacklist.add("exploit");
        blacklist.add("malware");
        blacklist.add("virus");
        blacklist.add("phishing");
        blacklist.add("scam");
        
        createBlacklistPatterns();
    }
    
    public static class FilterResult {
        private final boolean allowed;
        private final String content;
        private final String reason;
        
        public FilterResult(boolean allowed, String content, String reason) {
            this.allowed = allowed;
            this.content = content;
            this.reason = reason;
        }
        
        public boolean isAllowed() { return allowed; }
        public String getContent() { return content; }
        public String getReason() { return reason; }
    }

    public Set<String> getWhitelist() { return new HashSet<>(whitelist); }
    public Set<String> getBlacklist() { return new HashSet<>(blacklist); }
    public boolean isFilterEnabled() { return filterEnabled; }
}
