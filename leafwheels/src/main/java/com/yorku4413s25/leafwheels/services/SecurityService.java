package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.repositories.OrderRepository;
import com.yorku4413s25.leafwheels.repositories.PaymentRepository;
import com.yorku4413s25.leafwheels.repositories.CartRepository;
import com.yorku4413s25.leafwheels.repositories.ReviewRepository;
import lombok.RequiredArgsConstructor;
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
}
