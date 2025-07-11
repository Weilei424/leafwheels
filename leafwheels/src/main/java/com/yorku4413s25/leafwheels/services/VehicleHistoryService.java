package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.web.models.VehicleHistoryDto;

import java.util.List;
import java.util.UUID;

public interface VehicleHistoryService {
    VehicleHistoryDto getById(UUID vehicleHistoryId);
    
    VehicleHistoryDto create(VehicleHistoryDto vehicleHistoryDto);
    
    VehicleHistoryDto updateById(UUID vehicleHistoryId, VehicleHistoryDto vehicleHistoryDto);
    
    void delete(UUID vehicleHistoryId);
    
    List<VehicleHistoryDto> getByVehicleId(UUID vehicleId);
}