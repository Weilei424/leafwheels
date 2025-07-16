package com.yorku4413s25.leafwheels.web.models;

import com.yorku4413s25.leafwheels.constants.BodyType;
import com.yorku4413s25.leafwheels.constants.Condition;
import com.yorku4413s25.leafwheels.constants.Make;
import com.yorku4413s25.leafwheels.constants.VehicleStatus;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
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
    BigDecimal price;

    BigDecimal discountPercentage;

    @NonNull
    String vin;

    @NonNull
    Condition condition;

    String description;

    VehicleStatus status;

    List<String> imageUrls;
}