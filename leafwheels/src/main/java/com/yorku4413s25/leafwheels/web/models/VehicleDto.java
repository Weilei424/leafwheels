package com.yorku4413s25.leafwheels.web.models;

import com.yorku4413s25.leafwheels.constants.BodyType;
import com.yorku4413s25.leafwheels.constants.Condition;
import com.yorku4413s25.leafwheels.constants.Make;
import com.yorku4413s25.leafwheels.constants.VehicleStatus;
import lombok.*;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * DTO for {@link com.yorku4413s25.leafwheels.domain.Vehicle}
 */
@Builder
@Data
@AllArgsConstructor
@Schema(description = "Vehicle response DTO with automatically calculated discount information")
public class VehicleDto implements Serializable {

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
    @JsonSerialize(using = ToStringSerializer.class)
    BigDecimal price;

    @Schema(description = "Final discounted price calculated as: originalPrice * (1 - discountPercentage) OR originalPrice - discountAmount", example = "42500.00")
    @JsonSerialize(using = ToStringSerializer.class)
    BigDecimal discountPrice;

    @Schema(description = "Discount percentage as a decimal (e.g., 0.15 = 15% off)", example = "0.15")
    @JsonSerialize(using = ToStringSerializer.class)
    BigDecimal discountPercentage;

    @Schema(description = "Fixed discount amount subtracted from the original price", example = "5000.00")
    @JsonSerialize(using = ToStringSerializer.class)
    BigDecimal discountAmount;

    @Schema(description = "Automatically set to true when discountPercentage > 0 OR discountAmount > 0", example = "true")
    Boolean onDeal;

    @NonNull
    String vin;

    @NonNull
    Condition condition;

    String description;

    VehicleStatus status;

    List<String> imageUrls;

    List<VehicleHistoryDto> vehicleHistories;
}
