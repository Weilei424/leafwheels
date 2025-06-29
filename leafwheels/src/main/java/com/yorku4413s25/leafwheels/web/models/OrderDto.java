package com.yorku4413s25.leafwheels.web.models;

import com.yorku4413s25.leafwheels.constants.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDto {
    private UUID id;
    private UUID userId;
    private OrderStatus status;
    private BigDecimal totalPrice;
    private List<OrderItemDto> items;
}
