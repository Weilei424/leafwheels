package com.yorku4413s25.leafwheels.web.mappers;

import com.yorku4413s25.leafwheels.domain.Vehicle;
import com.yorku4413s25.leafwheels.web.models.VehicleDto;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(uses = DateMapper.class, componentModel = "spring")
public interface VehicleMapper {
    VehicleDto vehicleToVehicleDto(Vehicle vehicle);
    Vehicle vehicleDtoToVehicle(VehicleDto vehicleDto);
    void vehicleDtoToVehicleUpdate(VehicleDto vehicleDto, @MappingTarget Vehicle existing);
}
