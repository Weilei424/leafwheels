package com.yorku4413s25.leafwheels.services;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {
    
    @Value("${rate-limit.chat.requests-per-minute:20}")
    private int requestsPerMinute;
    
    @Value("${rate-limit.chat.requests-per-hour:200}")
    private int requestsPerHour;
    
    @Value("${rate-limit.chat.requests-per-day:1000}")
    private int requestsPerDay;
    
    private final Map<String, Bucket> userBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> ipBuckets = new ConcurrentHashMap<>();
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    public boolean isAllowed(String userId, String ipAddress) {
        if (userId != null && !userId.isEmpty()) {
            if (!checkUserRateLimit(userId)) {
                return false;
            }
        }

        return checkIpRateLimit(ipAddress);
    }
    
    public boolean checkUserRateLimit(String userId) {
        Bucket bucket = getUserBucket(userId);
        return bucket.tryConsume(1);
    }
    
    public boolean checkIpRateLimit(String ipAddress) {
        Bucket bucket = getIpBucket(ipAddress);
        return bucket.tryConsume(1);
    }
    
    public long getRemainingTokens(String userId) {
        if (userId == null || userId.isEmpty()) {
            return 0;
        }
        
        Bucket bucket = getUserBucket(userId);
        return bucket.getAvailableTokens();
    }
    
    public long getTimeUntilReset(String userId) {
        if (userId == null || userId.isEmpty()) {
            return 0;
        }

        long remainingTokens = getRemainingTokens(userId);
        if (remainingTokens > 0) {
            return 0;
        }

        return 60;
    }
    
    private Bucket getUserBucket(String userId) {
        return userBuckets.computeIfAbsent(userId, this::createUserBucket);
    }
    
    private Bucket getIpBucket(String ipAddress) {
        return ipBuckets.computeIfAbsent(ipAddress, this::createIpBucket);
    }
    
    private Bucket createUserBucket(String userId) {
        return Bucket.builder()
                .addLimit(Bandwidth.classic(requestsPerMinute, Refill.intervally(requestsPerMinute, Duration.ofMinutes(1))))
                .addLimit(Bandwidth.classic(requestsPerHour, Refill.intervally(requestsPerHour, Duration.ofHours(1))))
                .addLimit(Bandwidth.classic(requestsPerDay, Refill.intervally(requestsPerDay, Duration.ofDays(1))))
                .build();
    }
    
    private Bucket createIpBucket(String ipAddress) {
        int ipRequestsPerMinute = Math.min(requestsPerMinute / 2, 10);
        int ipRequestsPerHour = Math.min(requestsPerHour / 2, 100);
        
        return Bucket.builder()
                .addLimit(Bandwidth.classic(ipRequestsPerMinute, Refill.intervally(ipRequestsPerMinute, Duration.ofMinutes(1))))
                .addLimit(Bandwidth.classic(ipRequestsPerHour, Refill.intervally(ipRequestsPerHour, Duration.ofHours(1))))
                .build();
    }
    
    public RateLimitInfo getRateLimitInfo(String userId) {
        if (userId == null || userId.isEmpty()) {
            return new RateLimitInfo(0, requestsPerMinute, 0);
        }
        
        Bucket bucket = getUserBucket(userId);
        long remainingTokens = bucket.getAvailableTokens();
        long resetTime = getTimeUntilReset(userId);
        
        return new RateLimitInfo(remainingTokens, requestsPerMinute, resetTime);
    }
    
    public static class RateLimitInfo {
        private final long remainingRequests;
        private final long requestLimit;
        private final long resetTimeSeconds;
        
        public RateLimitInfo(long remainingRequests, long requestLimit, long resetTimeSeconds) {
            this.remainingRequests = remainingRequests;
            this.requestLimit = requestLimit;
            this.resetTimeSeconds = resetTimeSeconds;
        }
        
        public long getRemainingRequests() { return remainingRequests; }
        public long getRequestLimit() { return requestLimit; }
        public long getResetTimeSeconds() { return resetTimeSeconds; }
    }
}
