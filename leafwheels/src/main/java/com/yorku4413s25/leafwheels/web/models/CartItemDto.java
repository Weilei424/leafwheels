package com.yorku4413s25.leafwheels.web.models;

import com.yorku4413s25.leafwheels.constants.ItemType;
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
public class CartItemDto {
    private UUID id;
    private ItemType type;
    private VehicleDto vehicle;
    private AccessoryDto accessory;
    private BigDecimal unitPrice;
    private int quantity;
}
