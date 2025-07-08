package com.yorku4413s25.leafwheels.web.models;

import com.yorku4413s25.leafwheels.constants.ItemType;
import com.yorku4413s25.leafwheels.domain.OrderItem;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * DTO for {@link OrderItem}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDto {

    @NonNull
    UUID id;

    @NonNull
    ItemType type;

    VehicleDto vehicle;
    AccessoryDto accessory;

    @NonNull
    BigDecimal unitPrice;

    @NonNull
    int quantity;
}
