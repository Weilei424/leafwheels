package com.yorku4413s25.leafwheels.web.models;

import com.yorku4413s25.leafwheels.domain.Accessory;
import lombok.Value;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.UUID;

/**
 * DTO for {@link Accessory}
 */
@Value
public class AccessoryDto implements Serializable {
    UUID id;
    String name;
    String description;
    BigDecimal price;
    int quantity;
}
