package com.yorku4413s25.leafwheels.web.models;

import com.yorku4413s25.leafwheels.constants.OrderItemType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderItemDto {
    private OrderItemType type;
    private UUID vehicleId;
    private UUID accessoryId;     // For ACCESSORY
    private String accessoryName; // For ACCESSORY
    private BigDecimal unitPrice;
    private int quantity;
}
