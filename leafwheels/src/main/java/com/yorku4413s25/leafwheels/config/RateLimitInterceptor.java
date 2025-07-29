package com.yorku4413s25.leafwheels.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yorku4413s25.leafwheels.services.RateLimitService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class RateLimitInterceptor implements HandlerInterceptor {

    private RateLimitService rateLimitService;

    private ObjectMapper objectMapper;
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String requestURI = request.getRequestURI();
        if (!requestURI.startsWith("/api/v1/chat")) {
            return true;
        }
        
        String userId = getUserId();
        String ipAddress = getClientIpAddress(request);
        
        boolean allowed = rateLimitService.isAllowed(userId, ipAddress);
        
        if (!allowed) {
            handleRateLimitExceeded(response, userId);
            return false;
        }

        addRateLimitHeaders(response, userId);
        
        return true;
    }
    
    private String getUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && 
            authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            return userDetails.getUsername();
        }
        return null;
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String[] headerNames = {
            "X-Forwarded-For",
            "X-Real-IP", 
            "Proxy-Client-IP",
            "WL-Proxy-Client-IP",
            "HTTP_CLIENT_IP",
            "HTTP_X_FORWARDED_FOR"
        };
        
        for (String headerName : headerNames) {
            String ip = request.getHeader(headerName);
            if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
                return ip.split(",")[0].trim();
            }
        }
        
        return request.getRemoteAddr();
    }
    
    private void handleRateLimitExceeded(HttpServletResponse response, String userId) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "Rate limit exceeded");
        errorResponse.put("message", "Too many requests. Please try again later.");
        errorResponse.put("status", HttpStatus.TOO_MANY_REQUESTS.value());
        
        if (userId != null) {
            RateLimitService.RateLimitInfo rateLimitInfo = rateLimitService.getRateLimitInfo(userId);
            errorResponse.put("remainingRequests", rateLimitInfo.getRemainingRequests());
            errorResponse.put("resetTimeSeconds", rateLimitInfo.getResetTimeSeconds());
        }
        
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
    
    private void addRateLimitHeaders(HttpServletResponse response, String userId) {
        if (userId != null) {
            RateLimitService.RateLimitInfo rateLimitInfo = rateLimitService.getRateLimitInfo(userId);
            response.setHeader("X-RateLimit-Limit", String.valueOf(rateLimitInfo.getRequestLimit()));
            response.setHeader("X-RateLimit-Remaining", String.valueOf(rateLimitInfo.getRemainingRequests()));
            response.setHeader("X-RateLimit-Reset", String.valueOf(System.currentTimeMillis() / 1000 + rateLimitInfo.getResetTimeSeconds()));
        }
    }
}
