package com.yorku4413s25.leafwheels.web.controllers;

import com.yorku4413s25.leafwheels.services.OrderService;
import com.yorku4413s25.leafwheels.web.models.CreateOrderRequestDto;
import com.yorku4413s25.leafwheels.web.models.OrderDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
        return new ResponseEntity<>(orderService.createOrder(userId, dto), HttpStatus.CREATED);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDto> getOrder(@PathVariable UUID orderId) {
        return new ResponseEntity<>(orderService.getOrderById(orderId), HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDto>> getOrdersByUser(@PathVariable UUID userId) {
        return new ResponseEntity<>(orderService.getOrdersByUserId(userId), HttpStatus.OK);
    }

    @PostMapping("/from-cart/{userId}")
    public ResponseEntity<OrderDto> createOrderFromCart(@PathVariable UUID userId) {
        return new ResponseEntity<>(orderService.createOrderFromCart(userId), HttpStatus.CREATED);
    }

    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<Void> cancelOrder(@PathVariable UUID orderId) {
        orderService.cancelOrder(orderId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
