package com.yorku4413s25.leafwheels.web.mappers;

import com.yorku4413s25.leafwheels.domain.VehicleHistory;
import com.yorku4413s25.leafwheels.web.models.VehicleHistoryDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(uses = DateMapper.class, componentModel = "spring")
public interface VehicleHistoryMapper {
    @Mapping(target = "vehicleId", source = "vehicle.id")
    VehicleHistoryDto vehicleHistoryToVehicleHistoryDto(VehicleHistory vehicleHistory);
    
    @Mapping(target = "vehicle", ignore = true)
    VehicleHistory vehicleHistoryDtoToVehicleHistory(VehicleHistoryDto vehicleHistoryDto);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "vehicle", ignore = true)
    void vehicleHistoryDtoToVehicleHistoryUpdate(VehicleHistoryDto vehicleHistoryDto, @MappingTarget VehicleHistory existing);
}