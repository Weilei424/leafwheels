package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.repositories.OrderRepository;
import com.yorku4413s25.leafwheels.repositories.PaymentRepository;
import com.yorku4413s25.leafwheels.repositories.CartRepository;
import com.yorku4413s25.leafwheels.repositories.ReviewRepository;
import com.yorku4413s25.leafwheels.security.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SecurityService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final CartRepository cartRepository;
    private final ReviewRepository reviewRepository;

    /**
     * Check if an order belongs to a specific user
     */
    public boolean isOrderOwnedByUser(UUID orderId, UUID userId) {
        return orderRepository.findById(orderId)
                .map(order -> order.getUserId().equals(userId))
                .orElse(false);
    }

    /**
     * Check if a payment belongs to a specific user
     */
    public boolean isPaymentOwnedByUser(UUID paymentId, UUID userId) {
        return paymentRepository.findById(paymentId)
                .map(payment -> payment.getOrder().getUserId().equals(userId))
                .orElse(false);
    }

    /**
     * Check if a cart belongs to a specific user
     */
    public boolean isCartOwnedByUser(UUID cartId, UUID userId) {
        return cartRepository.findById(cartId)
                .map(cart -> cart.getUserId().equals(userId))
                .orElse(false);
    }

    /**
     * Check if a review belongs to a specific user
     */
    public boolean isReviewOwnedByUser(UUID reviewId, UUID userId) {
        return reviewRepository.findById(reviewId)
                .map(review -> review.getUserId().equals(userId))
                .orElse(false);
    }

    /**
     * Check if the current user matches the provided userId
     */
    public boolean isCurrentUser(UUID userId, UUID currentUserId) {
        return userId.equals(currentUserId);
    }

    /**
     * Check if the authenticated user matches the provided userId
     */
    public boolean isCurrentUser(UUID userId, Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return false;
        }
        
        CustomUserDetailsService.UserPrincipal userPrincipal = 
            (CustomUserDetailsService.UserPrincipal) authentication.getPrincipal();
        return userId.equals(userPrincipal.getUser().getId());
    }

    /**
     * Check if an order belongs to the authenticated user
     */
    public boolean isOrderOwnedByUser(UUID orderId, Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return false;
        }
        
        CustomUserDetailsService.UserPrincipal userPrincipal = 
            (CustomUserDetailsService.UserPrincipal) authentication.getPrincipal();
        return isOrderOwnedByUser(orderId, userPrincipal.getUser().getId());
    }

    /**
     * Check if a payment belongs to the authenticated user
     */
    public boolean isPaymentOwnedByUser(UUID paymentId, Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return false;
        }
        
        CustomUserDetailsService.UserPrincipal userPrincipal = 
            (CustomUserDetailsService.UserPrincipal) authentication.getPrincipal();
        return isPaymentOwnedByUser(paymentId, userPrincipal.getUser().getId());
    }

    /**
     * Check if a review belongs to the authenticated user
     */
    public boolean isReviewOwnedByUser(UUID reviewId, Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return false;
        }
        
        CustomUserDetailsService.UserPrincipal userPrincipal = 
            (CustomUserDetailsService.UserPrincipal) authentication.getPrincipal();
        return isReviewOwnedByUser(reviewId, userPrincipal.getUser().getId());
    }
}
