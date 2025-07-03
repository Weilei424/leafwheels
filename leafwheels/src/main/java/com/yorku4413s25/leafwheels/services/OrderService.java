package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.web.models.CreateOrderRequestDto;
import com.yorku4413s25.leafwheels.web.models.OrderDto;

import java.util.List;
import java.util.UUID;

public interface OrderService {
    OrderDto createOrder(UUID userId, CreateOrderRequestDto dto);
    OrderDto getOrderById(UUID orderId);
    List<OrderDto> getOrdersByUserId(UUID userId);
    OrderDto createOrderFromCart(UUID userId);
    void cancelOrder(UUID orderId);
}
