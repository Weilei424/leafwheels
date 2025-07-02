package com.yorku4413s25.leafwheels.web.models;

import com.yorku4413s25.leafwheels.constants.OrderStatus;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDto {

    @NonNull
    private UUID id;

    @NonNull
    private UUID userId;

    @NonNull
    private OrderStatus status;

    @NonNull
    private BigDecimal totalPrice;

    private List<OrderItemDto> items;
}
