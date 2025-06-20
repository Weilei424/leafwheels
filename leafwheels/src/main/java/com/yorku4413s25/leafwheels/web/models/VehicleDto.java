package com.yorku4413s25.leafwheels.web.models;

import com.yorku4413s25.leafwheels.constants.BodyType;
import com.yorku4413s25.leafwheels.constants.Condition;
import com.yorku4413s25.leafwheels.constants.Make;
import com.yorku4413s25.leafwheels.constants.VehicleStatus;
import lombok.Value;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.UUID;

/**
 * DTO for {@link com.yorku4413s25.leafwheels.domain.Vehicle}
 */
@Value
public class VehicleDto implements Serializable {
    UUID id;
    int year;
    Make make;
    String model;
    BodyType bodyType;
    String exteriorColor;
    int doors;
    int seats;
    int mileage;
    int batteryRange;
    String trim;
    BigDecimal price;
    boolean onDeal;
    String vin;
    BigDecimal discountPercent;
    Condition condition;
    String description;
    VehicleStatus status;

}
