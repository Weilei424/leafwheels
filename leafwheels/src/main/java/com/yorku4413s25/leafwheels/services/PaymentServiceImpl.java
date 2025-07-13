package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.constants.OrderStatus;
import com.yorku4413s25.leafwheels.constants.PaymentStatus;
import com.yorku4413s25.leafwheels.constants.VehicleStatus;
import com.yorku4413s25.leafwheels.domain.*;
import com.yorku4413s25.leafwheels.exception.EntityNotFoundException;
import com.yorku4413s25.leafwheels.repositories.*;
import com.yorku4413s25.leafwheels.web.mappers.PaymentMapper;
import com.yorku4413s25.leafwheels.web.models.OrderDto;
import com.yorku4413s25.leafwheels.web.models.PaymentRequestDto;
import com.yorku4413s25.leafwheels.web.models.PaymentResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.servlet.http.HttpSession;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final VehicleRepository vehicleRepository;
    private final PaymentMapper paymentMapper;
    private final OrderService orderService;
    private final CartService cartService;
    private final CartChecksumService cartChecksumService;

    @Override
    @Transactional
    public void createPaymentSession(UUID userId, HttpSession httpSession) {
        Cart cart = cartRepository.findByUserId(userId)
            .orElseThrow(() -> new EntityNotFoundException(userId, Cart.class));

        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cannot create payment session for empty cart");
        }

        String cartChecksum = cartChecksumService.calculateChecksum(cart);
        httpSession.setAttribute("cartId", cart.getId());
        httpSession.setAttribute("cartChecksum", cartChecksum);
    }

    @Override
    @Transactional
    public PaymentResponseDto processPayment(UUID userId, PaymentRequestDto paymentRequest, HttpSession httpSession) {

        UUID cartId = (UUID) httpSession.getAttribute("cartId");
        String sessionCartChecksum = (String) httpSession.getAttribute("cartChecksum");

        if (cartId == null || sessionCartChecksum == null) {
            throw new IllegalArgumentException("No payment session found in current session");
        }

        Cart cart = cartRepository.findByUserId(userId)
            .orElseThrow(() -> new EntityNotFoundException(userId, Cart.class));

        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cannot process payment for empty cart");
        }

        String currentChecksum = cartChecksumService.calculateChecksum(cart);
        if (!currentChecksum.equals(sessionCartChecksum)) {
            throw new IllegalStateException("Cart has been modified since payment session was created");
        }

        httpSession.removeAttribute("cartId");
        httpSession.removeAttribute("cartChecksum");

        OrderDto orderDto = orderService.createOrderFromCart(userId);
        Order order = orderRepository.findById(orderDto.getId())
            .orElseThrow(() -> new EntityNotFoundException(orderDto.getId(), Order.class));

        long totalPaymentAttempts = paymentRepository.countAllPayments();
        boolean isApproved = (totalPaymentAttempts % 3) != 2;

        Payment payment = Payment.builder()
            .userId(userId)
            .order(order)
            .amount(order.getTotalPrice())
            .paymentMethod(paymentRequest.getPaymentMethod())
            .address(paymentRequest.getAddress())
            .transactionId(UUID.randomUUID().toString())
            .build();

        if (isApproved) {
            payment.setStatus(PaymentStatus.APPROVED);

            order.setStatus(OrderStatus.PAID);
            orderRepository.save(order);

            updateVehicleStatuses(order);

            cartService.clearCart(userId);

            log.info("Payment approved for order: {}", order.getId());
        } else {
            payment.setStatus(PaymentStatus.DENIED);
            payment.setFailureReason("Credit Card Authorization Failed");

            order.setStatus(OrderStatus.CANCELED);
            orderRepository.save(order);

            log.info("Payment denied for order: {}", order.getId());
        }

        payment = paymentRepository.save(payment);

        return paymentMapper.toDto(payment);
    }

    @Override
    public PaymentResponseDto getPaymentStatus(UUID orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
            .orElseThrow(() -> new EntityNotFoundException(orderId, Payment.class));

        return paymentMapper.toDto(payment);
    }

    @Override
    public List<PaymentResponseDto> getPaymentsByUserId(UUID userId) {
        List<Payment> payments = paymentRepository.findByUserId(userId);
        return payments.stream()
            .map(paymentMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cancelPayment(UUID orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
            .orElseThrow(() -> new EntityNotFoundException(orderId, Payment.class));

        if (payment.getStatus() == PaymentStatus.APPROVED) {
            payment.setStatus(PaymentStatus.REFUNDED);
            paymentRepository.save(payment);

            Order order = payment.getOrder();
            order.setStatus(OrderStatus.CANCELED);
            orderRepository.save(order);

            revertVehicleStatuses(order);

            log.info("Payment refunded for order: {}", orderId);
        }
    }

    private void updateVehicleStatuses(Order order) {
        for (OrderItem item : order.getItems()) {
            if (item.getVehicle() != null) {
                Vehicle vehicle = item.getVehicle();
                vehicle.setStatus(VehicleStatus.SOLD);
                vehicleRepository.save(vehicle);
            }
        }
    }

    private void revertVehicleStatuses(Order order) {
        for (OrderItem item : order.getItems()) {
            if (item.getVehicle() != null) {
                Vehicle vehicle = item.getVehicle();
                vehicle.setStatus(VehicleStatus.AVAILABLE);
                vehicleRepository.save(vehicle);
            }
        }
    }

}
