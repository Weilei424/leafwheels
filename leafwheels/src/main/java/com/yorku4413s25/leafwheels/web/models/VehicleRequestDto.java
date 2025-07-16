package com.yorku4413s25.leafwheels.web.models;

import com.yorku4413s25.leafwheels.constants.BodyType;
import com.yorku4413s25.leafwheels.constants.Condition;
import com.yorku4413s25.leafwheels.constants.Make;
import com.yorku4413s25.leafwheels.constants.VehicleStatus;
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
@Schema(description = "Vehicle request DTO for creating/updating vehicles. The discount system automatically calculates the final discounted price and deal status based on either discount percentage or discount amount. Only one discount method can be used at a time.")
public class VehicleRequestDto implements Serializable {

    UUID id;

    int year;

    @NonNull
    Make make;

    @NonNull
    String model;

    @NonNull
    BodyType bodyType;

    String exteriorColor;

    int doors;

    int seats;

    int mileage;

    int batteryRange;

    String trim;

    @NonNull
    @Schema(description = "Original price of the vehicle before any discounts", example = "50000.00")
    BigDecimal price;

    @Schema(description = "Discount percentage as a decimal (e.g., 0.15 = 15% off). Defaults to 0.00 (no discount). The final discounted price is automatically calculated as: discountPrice = originalPrice * (1 - discountPercentage). Cannot be used together with discountAmount.", example = "0.15")
    BigDecimal discountPercentage;

    @Schema(description = "Fixed discount amount to subtract from the original price. Defaults to 0.00 (no discount). The final discounted price is automatically calculated as: discountPrice = originalPrice - discountAmount. Cannot be used together with discountPercentage.", example = "5000.00")
    BigDecimal discountAmount;

    @NonNull
    String vin;

    @NonNull
    Condition condition;

    String description;

    VehicleStatus status;

    List<String> imageUrls;
}