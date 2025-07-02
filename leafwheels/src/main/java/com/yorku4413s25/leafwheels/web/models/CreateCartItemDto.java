package com.yorku4413s25.leafwheels.web.models;

import com.yorku4413s25.leafwheels.constants.ItemType;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCartItemDto {

    @NonNull
    private ItemType type;

    private UUID vehicleId;

    private UUID accessoryId;

    @NonNull
    private BigDecimal unitPrice;

    @NonNull
    private int quantity;
}
