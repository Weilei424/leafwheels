package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.domain.Vehicle;
import com.yorku4413s25.leafwheels.exception.EntityNotFoundException;
import com.yorku4413s25.leafwheels.web.models.VehicleDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
public class VehicleServiceImpl implements VehicleService {
    @Override
    public VehicleDto getById(UUID vehicleId) {
        return null;
    }

    @Override
    public VehicleDto create(VehicleDto vehicleDto) {
        return null;
    }

    @Override
    public void update(UUID vehicleId, VehicleDto vehicleDto) {

    }

    @Override
    public void delete(UUID vehicleId) {

    }

    @Override
    public List<VehicleDto> getAllVehicles() {
        return List.of();
    }

    static Vehicle unwrapVehicle(Optional<Vehicle> entity, UUID id) {
        if (entity.isPresent()) return entity.get();
        else throw new EntityNotFoundException(id, Vehicle.class);
    }
}
