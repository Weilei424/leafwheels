package com.yorku4413s25.leafwheels.web.models;

import com.yorku4413s25.leafwheels.constants.BodyType;
import com.yorku4413s25.leafwheels.constants.Condition;
import com.yorku4413s25.leafwheels.constants.Make;
import com.yorku4413s25.leafwheels.constants.VehicleStatus;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.UUID;

/**
 * DTO for {@link com.yorku4413s25.leafwheels.domain.Vehicle}
 */
@Builder
@Data
@AllArgsConstructor
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
    BigDecimal price;

    boolean onDeal;

    @NonNull
    String vin;

    BigDecimal discountPercent;

    @NonNull
    Condition condition;

    String description;

    VehicleStatus status;
}
