package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.constants.BodyType;
import com.yorku4413s25.leafwheels.constants.Condition;
import com.yorku4413s25.leafwheels.constants.Make;
import com.yorku4413s25.leafwheels.constants.VehicleStatus;
import com.yorku4413s25.leafwheels.domain.Vehicle;
import com.yorku4413s25.leafwheels.web.models.VehicleDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface VehicleService {
    VehicleDto getById(UUID vehicleId);

    VehicleDto create(VehicleDto vehicleDto);

    VehicleDto updateById(UUID vehicleId, VehicleDto vehicleDto);

    void delete(UUID vehicleId);

    List<VehicleDto> getAllVehicles();

    Page<VehicleDto> filterVehicles(
            Integer year,
            Make make,
            String model,
            BodyType bodyType,
            String exteriorColor,
            Integer doors,
            Integer seats,
            Integer minMileage,
            Integer maxMileage,
            Integer minBatteryRange,
            Integer maxBatteryRange,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean onDeal,
            Condition condition,
            VehicleStatus status,
            Boolean hasAccidentHistory,
            Pageable pageable
    );
}
