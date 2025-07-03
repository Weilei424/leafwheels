package com.yorku4413s25.leafwheels.web.controllers;

import com.yorku4413s25.leafwheels.services.OrderService;
import com.yorku4413s25.leafwheels.web.models.CreateOrderRequestDto;
import com.yorku4413s25.leafwheels.web.models.OrderDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/{userId}")
    public ResponseEntity<OrderDto> createOrder(@PathVariable UUID userId, @RequestBody CreateOrderRequestDto dto) {
        OrderDto order = orderService.createOrder(userId, dto);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDto> getOrder(@PathVariable UUID orderId) {
        OrderDto order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDto>> getOrdersByUser(@PathVariable UUID userId) {
        List<OrderDto> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    @PostMapping("/from-cart/{userId}")
    public ResponseEntity<OrderDto> createOrderFromCart(@PathVariable UUID userId) {
        OrderDto order = orderService.createOrderFromCart(userId);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<Void> cancelOrder(@PathVariable UUID orderId) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.ok().build();
    }
}
