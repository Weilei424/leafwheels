package com.yorku4413s25.leafwheels.web.models;

import com.yorku4413s25.leafwheels.domain.Accessory;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * DTO for {@link Accessory}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccessoryDto {

    @NonNull
    UUID id;

    @NonNull
    String name;

    String description;

    @NonNull
    BigDecimal price;

    @NonNull
    int quantity;
}
