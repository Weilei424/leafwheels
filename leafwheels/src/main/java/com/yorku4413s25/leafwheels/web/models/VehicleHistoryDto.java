package com.yorku4413s25.leafwheels.web.models;

import lombok.*;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class VehicleHistoryDto implements Serializable {

    UUID id;

    @NotNull(message = "Accident date is required")
    Instant accidentDate;

    @NotNull(message = "Repair cost is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Repair cost must be greater than 0")
    BigDecimal repairCost;

    @NotBlank(message = "Accident description is required")
    @Size(max = 1000, message = "Accident description must not exceed 1000 characters")
    String accidentDescription;

    @NotNull(message = "Vehicle ID is required")
    UUID vehicleId;
}