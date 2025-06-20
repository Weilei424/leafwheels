package com.yorku4413s25.leafwheels.web.mappers;

import com.yorku4413s25.leafwheels.domain.Vehicle;
import com.yorku4413s25.leafwheels.web.models.VehicleDto;
import org.springframework.stereotype.Component;

@Component
public class VehicleMapper {
    
    public VehicleDto vehicleToVehicleDto(Vehicle vehicle) {
        if (vehicle == null) {
            return null;
        }
        
        return new VehicleDto(
            vehicle.getId(),
            vehicle.getYear(),
            vehicle.getMake(),
            vehicle.getModel(),
            vehicle.getBodyType(),
            vehicle.getExteriorColor(),
            vehicle.getDoors(),
            vehicle.getSeats(),
            vehicle.getMileage(),
            vehicle.getBatteryRange(),
            vehicle.getTrim(),
            vehicle.getPrice(),
            vehicle.isOnDeal(),
            vehicle.getVin(),
            vehicle.getDiscountPercent(),
            vehicle.getCondition(),
            vehicle.getDescription(),
            vehicle.getStatus()
        );
    }
    
    public Vehicle vehicleDtoToVehicle(VehicleDto vehicleDto) {
        if (vehicleDto == null) {
            return null;
        }
        
        Vehicle.VehicleBuilder builder = Vehicle.builder()
            .year(vehicleDto.getYear())
            .make(vehicleDto.getMake())
            .model(vehicleDto.getModel())
            .bodyType(vehicleDto.getBodyType())
            .exteriorColor(vehicleDto.getExteriorColor())
            .doors(vehicleDto.getDoors())
            .seats(vehicleDto.getSeats())
            .mileage(vehicleDto.getMileage())
            .batteryRange(vehicleDto.getBatteryRange())
            .trim(vehicleDto.getTrim())
            .price(vehicleDto.getPrice())
            .onDeal(vehicleDto.isOnDeal())
            .vin(vehicleDto.getVin())
            .discountPercent(vehicleDto.getDiscountPercent())
            .condition(vehicleDto.getCondition())
            .description(vehicleDto.getDescription())
            .status(vehicleDto.getStatus());
            
        // Only set ID if it's not null (for new vehicles)
        if (vehicleDto.getId() != null) {
            builder.id(vehicleDto.getId());
        }
        
        return builder.build();
    }
    
    public void vehicleDtoToVehicleUpdate(VehicleDto vehicleDto, Vehicle existing) {
        if (vehicleDto == null || existing == null) {
            return;
        }
        
        existing.setYear(vehicleDto.getYear());
        existing.setMake(vehicleDto.getMake());
        existing.setModel(vehicleDto.getModel());
        existing.setBodyType(vehicleDto.getBodyType());
        existing.setExteriorColor(vehicleDto.getExteriorColor());
        existing.setDoors(vehicleDto.getDoors());
        existing.setSeats(vehicleDto.getSeats());
        existing.setMileage(vehicleDto.getMileage());
        existing.setBatteryRange(vehicleDto.getBatteryRange());
        existing.setTrim(vehicleDto.getTrim());
        existing.setPrice(vehicleDto.getPrice());
        existing.setOnDeal(vehicleDto.isOnDeal());
        existing.setVin(vehicleDto.getVin());
        existing.setDiscountPercent(vehicleDto.getDiscountPercent());
        existing.setCondition(vehicleDto.getCondition());
        existing.setDescription(vehicleDto.getDescription());
        existing.setStatus(vehicleDto.getStatus());
    }
}