package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.web.models.VehicleDto;

import java.util.List;
import java.util.UUID;

public interface VehicleService {
    VehicleDto getById(UUID vehicleId);

    VehicleDto create(VehicleDto vehicleDto);

    VehicleDto updateById(UUID vehicleId, VehicleDto vehicleDto);

    void delete(UUID vehicleId);

    List<VehicleDto> getAllVehicles();
}
