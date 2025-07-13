package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.web.models.PaymentRequestDto;
import com.yorku4413s25.leafwheels.web.models.PaymentResponseDto;
import jakarta.servlet.http.HttpSession;

import java.util.List;
import java.util.UUID;

public interface PaymentService {
    void createPaymentSession(UUID userId, HttpSession httpSession);
    PaymentResponseDto processPayment(UUID userId, PaymentRequestDto paymentRequest, HttpSession httpSession);
    PaymentResponseDto getPaymentStatus(UUID orderId);
    List<PaymentResponseDto> getPaymentsByUserId(UUID userId);
    void cancelPayment(UUID orderId);
}
