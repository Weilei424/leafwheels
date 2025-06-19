package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.domain.Vehicle;
import com.yorku4413s25.leafwheels.exception.EntityNotFoundException;
import com.yorku4413s25.leafwheels.repositories.VehicleRepository;
import com.yorku4413s25.leafwheels.web.mappers.VehicleMapper;
import com.yorku4413s25.leafwheels.web.models.VehicleDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
@Transactional
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleMapper vehicleMapper;

    @Override
    public VehicleDto getById(UUID vehicleId) {
        return vehicleMapper.vehicleToVehicleDto(
                vehicleRepository.findById(vehicleId)
                        .orElseThrow(() -> new EntityNotFoundException(vehicleId, Vehicle.class))
        );
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
}
