package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.domain.Vehicle;
import com.yorku4413s25.leafwheels.exception.EntityNotFoundException;
import com.yorku4413s25.leafwheels.repositories.VehicleRepository;
import com.yorku4413s25.leafwheels.web.mappers.DateMapper;
import com.yorku4413s25.leafwheels.web.mappers.VehicleMapper;
import com.yorku4413s25.leafwheels.web.models.VehicleDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.StreamSupport;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
@Transactional
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleMapper vehicleMapper;
    private final DateMapper dateMapper;

    @Override
    public VehicleDto getById(UUID vehicleId) {
        return vehicleMapper.vehicleToVehicleDto(
                vehicleRepository.findById(vehicleId)
                        .orElseThrow(() -> new EntityNotFoundException(vehicleId, Vehicle.class))
        );
    }

    @Override
    public VehicleDto create(VehicleDto vehicleDto) {
        Vehicle vehicle = vehicleMapper.vehicleDtoToVehicle(vehicleDto);
        vehicleRepository.save(vehicle);
        return vehicleMapper.vehicleToVehicleDto(vehicleRepository.save(vehicle));
    }

    @Override
    public VehicleDto updateById(UUID vehicleId, VehicleDto vehicleDto) {
        Vehicle existing = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new EntityNotFoundException(vehicleId, Vehicle.class));

        vehicleMapper.vehicleDtoToVehicleUpdate(vehicleDto, existing);
        return vehicleMapper.vehicleToVehicleDto(vehicleRepository.save(existing));
    }

    @Override
    public void delete(UUID vehicleId) {
        if (!vehicleRepository.existsById(vehicleId)) {
            throw new EntityNotFoundException(vehicleId, Vehicle.class);
        }
        vehicleRepository.deleteById(vehicleId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleDto> getAllVehicles() {
        return StreamSupport.stream(vehicleRepository.findAll().spliterator(), false)
                .map(vehicleMapper::vehicleToVehicleDto)
                .collect(Collectors.toList());
    }
}
