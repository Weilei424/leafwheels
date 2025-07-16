package com.yorku4413s25.leafwheels.web.models;

import lombok.*;
import io.swagger.v3.oas.annotations.media.Schema;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Accessory request DTO for creating/updating accessories. The discount system automatically calculates the final discounted price and deal status based on either discount percentage or discount amount. Only one discount method can be used at a time.")
public class AccessoryRequestDto implements Serializable {

    UUID id;

    @NonNull
    String name;

    String description;

    @NonNull
    @Schema(description = "Original price of the accessory before any discounts", example = "150.00")
    BigDecimal price;

    @Schema(description = "Discount percentage as a decimal (e.g., 0.15 = 15% off). Defaults to 0.00 (no discount). The final discounted price is automatically calculated as: discountPrice = originalPrice * (1 - discountPercentage). Cannot be used together with discountAmount.", example = "0.15")
    BigDecimal discountPercentage;

    @Schema(description = "Fixed discount amount to subtract from the original price. Defaults to 0.00 (no discount). The final discounted price is automatically calculated as: discountPrice = originalPrice - discountAmount. Cannot be used together with discountPercentage.", example = "25.00")
    BigDecimal discountAmount;

    @NonNull
    int quantity;

    List<String> imageUrls;
}