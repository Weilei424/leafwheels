package com.yorku4413s25.leafwheels.web.models;

import com.yorku4413s25.leafwheels.domain.Accessory;
import lombok.*;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * DTO for {@link Accessory}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Accessory response DTO with automatically calculated discount information")
public class AccessoryDto {

    UUID id;

    @NonNull
    String name;

    String description;

    @NonNull
    @Schema(description = "Original price of the accessory before any discounts", example = "150.00")
    @JsonSerialize(using = ToStringSerializer.class)
    BigDecimal price;

    @Schema(description = "Final discounted price calculated as: originalPrice * (1 - discountPercentage) OR originalPrice - discountAmount", example = "127.50")
    @JsonSerialize(using = ToStringSerializer.class)
    BigDecimal discountPrice;

    @NonNull
    @Schema(description = "Discount percentage as a decimal (e.g., 0.15 = 15% off)", example = "0.15")
    @JsonSerialize(using = ToStringSerializer.class)
    BigDecimal discountPercentage;

    @Schema(description = "Fixed discount amount subtracted from the original price", example = "25.00")
    @JsonSerialize(using = ToStringSerializer.class)
    BigDecimal discountAmount;

    @Schema(description = "Automatically set to true when discountPercentage > 0 OR discountAmount > 0", example = "true")
    boolean onDeal;

    @NonNull
    int quantity;

    List<String> imageUrls;
}
