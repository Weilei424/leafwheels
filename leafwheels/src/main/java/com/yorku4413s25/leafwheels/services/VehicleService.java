package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.web.models.VehicleDto;
import com.yorku4413s25.leafwheels.constants.Condition;
import com.yorku4413s25.leafwheels.constants.Make;
import com.yorku4413s25.leafwheels.constants.BodyType;
import com.yorku4413s25.leafwheels.constants.VehicleStatus;
import java.math.BigDecimal;





import java.util.List;
import java.util.UUID;

public interface VehicleService {
    VehicleDto getById(UUID vehicleId);

    VehicleDto create(VehicleDto vehicleDto);

    void update(UUID vehicleId, VehicleDto vehicleDto);

    void delete(UUID vehicleId);

    List<VehicleDto> getAllVehicles();



    // methods for filtering and searching
    List<VehicleDto> getAvailableVehicles();
    List<VehicleDto> getLatestVehicles();
    List<VehicleDto> getVehiclesOnDeal();
    List<VehicleDto> searchVehicles(String keyword);
    List<VehicleDto> getVehiclesByMake(Make make);
    List<VehicleDto> getVehiclesByBodyType(BodyType bodyType);
    List<VehicleDto> getVehiclesByCondition(Condition condition);
    List<VehicleDto> getVehiclesByPriceRange(BigDecimal min, BigDecimal max);
    List<VehicleDto> getVehiclesByYearRange(int start, int end);
    List<VehicleDto> getVehiclesByBatteryRange(int min);


    // Status and discount management
    VehicleDto updateStatus(UUID id, VehicleStatus status);
    VehicleDto applyDiscount(UUID id, BigDecimal discountPercent);
    VehicleDto removeDiscount(UUID id);


    // Statistics
    Long getAvailableVehicleCount();
    BigDecimal getAveragePrice();
    BigDecimal getMinPrice();
    BigDecimal getMaxPrice();



}
