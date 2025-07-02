package com.yorku4413s25.leafwheels.web.controllers;

import com.yorku4413s25.leafwheels.services.OrderService;
import com.yorku4413s25.leafwheels.web.models.CreateOrderRequestDto;
import com.yorku4413s25.leafwheels.web.models.OrderDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/{userId}")
    public OrderDto createOrder(@PathVariable UUID userId, @RequestBody CreateOrderRequestDto dto) {
        return orderService.createOrder(userId, dto);
    }

    @GetMapping("/{orderId}")
    public OrderDto getOrder(@PathVariable UUID orderId) {
        return orderService.getOrderById(orderId);
    }

    @GetMapping("/user/{userId}")
    public List<OrderDto> getOrdersByUser(@PathVariable UUID userId) {
        return orderService.getOrdersByUserId(userId);
    }
}
