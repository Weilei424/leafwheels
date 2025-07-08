package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.constants.BodyType;
import com.yorku4413s25.leafwheels.constants.Condition;
import com.yorku4413s25.leafwheels.constants.Make;
import com.yorku4413s25.leafwheels.constants.VehicleStatus;
import com.yorku4413s25.leafwheels.domain.Vehicle;
import com.yorku4413s25.leafwheels.domain.VehicleSpecification;
import com.yorku4413s25.leafwheels.exception.EntityNotFoundException;
import com.yorku4413s25.leafwheels.repositories.VehicleRepository;
import com.yorku4413s25.leafwheels.web.mappers.DateMapper;
import com.yorku4413s25.leafwheels.web.mappers.VehicleMapper;
import com.yorku4413s25.leafwheels.web.models.VehicleDto;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.function.Function;
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
        return vehicleRepository.findAll().stream()
                .map(vehicleMapper::vehicleToVehicleDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<VehicleDto> filterVehicles(
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
            Pageable pageable
    ) {
        List<Specification<Vehicle>> specs = new ArrayList<>();

        //todo: validation and exception handling for invalid values
        addIfNotNull(specs, year, VehicleSpecification::hasYear);
        addIfNotNull(specs, make, VehicleSpecification::hasMake);
        addIfNotNull(specs, model, VehicleSpecification::hasModel);
        addIfNotNull(specs, bodyType, VehicleSpecification::hasBodyType);
        addIfNotNull(specs, exteriorColor, VehicleSpecification::hasExteriorColor);
        addIfNotNull(specs, doors, VehicleSpecification::hasDoors);
        addIfNotNull(specs, seats, VehicleSpecification::hasSeats);
        if (minMileage != null || maxMileage != null)
            specs.add(VehicleSpecification.hasMileageBetween(minMileage, maxMileage));
        if (minBatteryRange != null || maxBatteryRange != null)
            specs.add(VehicleSpecification.hasBatteryRangeBetween(minBatteryRange, maxBatteryRange));
        if (minPrice != null || maxPrice != null)
            specs.add(VehicleSpecification.hasPriceBetween(minPrice, maxPrice));
        addIfNotNull(specs, onDeal, VehicleSpecification::hasOnDeal);
        addIfNotNull(specs, condition, VehicleSpecification::hasCondition);
        addIfNotNull(specs, status, VehicleSpecification::hasStatus);

        Specification<Vehicle> finalSpec = Specification.allOf(specs);
        Page<Vehicle> vehicles = vehicleRepository.findAll(finalSpec, pageable);
        return vehicles.map(vehicleMapper::vehicleToVehicleDto);
    }

    private <T> void addIfNotNull(List<Specification<Vehicle>> specs, T value, Function<T, Specification<Vehicle>> fn) {
        if (value != null) {
            specs.add(fn.apply(value));
        }
    }
}
