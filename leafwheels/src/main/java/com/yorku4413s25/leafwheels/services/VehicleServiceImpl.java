package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.constants.*;
import com.yorku4413s25.leafwheels.domain.Vehicle;
import com.yorku4413s25.leafwheels.exception.EntityNotFoundException;
import com.yorku4413s25.leafwheels.repositories.VehicleRepository;
import com.yorku4413s25.leafwheels.web.mappers.DateMapper;
import com.yorku4413s25.leafwheels.web.mappers.VehicleMapper;
import com.yorku4413s25.leafwheels.web.models.VehicleDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
@Transactional
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleMapper vehicleMapper;
    private final DateMapper dateMapper;

    @Override
    public VehicleDto getById(UUID vehicleId) {
        Optional<Vehicle> vehicleOptional = vehicleRepository.findById(vehicleId);

        if (vehicleOptional.isEmpty()) {
            throw new EntityNotFoundException(vehicleId, Vehicle.class);
        }

        Vehicle vehicle = vehicleOptional.get();
        return vehicleMapper.vehicleToVehicleDto(vehicle);
    }

    @Override
    public VehicleDto create(VehicleDto vehicleDto) {
        // Convert the DTO to a Vehicle entity
        Vehicle newVehicle = vehicleMapper.vehicleDtoToVehicle(vehicleDto);

        // Set the timestamps for when this vehicle was created
        OffsetDateTime now = OffsetDateTime.now();
        newVehicle.setCreatedAt(dateMapper.asTimestamp(now));
        newVehicle.setUpdatedAt(dateMapper.asTimestamp(now));

        // Save to database and return the result
        Vehicle savedVehicle = vehicleRepository.save(newVehicle);
        return vehicleMapper.vehicleToVehicleDto(savedVehicle);
    }

    @Override
    public void update(UUID vehicleId, VehicleDto vehicleDto) {
        // First, check if the vehicle exists
        Optional<Vehicle> vehicleOptional = vehicleRepository.findById(vehicleId);
        if (vehicleOptional.isEmpty()) {
            throw new EntityNotFoundException(vehicleId, Vehicle.class);
        }

        // Get the existing vehicle and update it
        Vehicle existingVehicle = vehicleOptional.get();
        vehicleMapper.vehicleDtoToVehicleUpdate(vehicleDto, existingVehicle);

        // Update the timestamp to show when it was last modified
        existingVehicle.setUpdatedAt(dateMapper.asTimestamp(OffsetDateTime.now()));

        // Save the changes
        vehicleRepository.save(existingVehicle);
    }

    @Override
    public void delete(UUID vehicleId) {
        // Check if the vehicle exists before trying to delete it
        boolean vehicleExists = vehicleRepository.existsById(vehicleId);
        if (!vehicleExists) {
            throw new EntityNotFoundException(vehicleId, Vehicle.class);
        }

        vehicleRepository.deleteById(vehicleId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleDto> getAllVehicles() {
        List<Vehicle> allVehicles = vehicleRepository.findAll();
        return convertVehiclesToDtos(allVehicles);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleDto> getVehiclesByMake(Make make) {
        List<Vehicle> vehicles = vehicleRepository.findByMake(make);
        return convertVehiclesToDtos(vehicles);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleDto> getVehiclesByBodyType(BodyType bodyType) {
        List<Vehicle> vehicles = vehicleRepository.findByBodyType(bodyType);
        return convertVehiclesToDtos(vehicles);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleDto> getVehiclesByCondition(Condition condition) {
        List<Vehicle> vehicles = vehicleRepository.findByCondition(condition);
        return convertVehiclesToDtos(vehicles);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleDto> getVehiclesByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        List<Vehicle> vehicles = vehicleRepository.findByPriceBetween(minPrice, maxPrice);
        return convertVehiclesToDtos(vehicles);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleDto> getVehiclesByYearRange(int startYear, int endYear) {
        List<Vehicle> vehicles = vehicleRepository.findByYearBetween(startYear, endYear);
        return convertVehiclesToDtos(vehicles);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleDto> getAvailableVehicles() {
        List<Vehicle> vehicles = vehicleRepository.findByStatus(VehicleStatus.AVAILABLE);
        return convertVehiclesToDtos(vehicles);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleDto> getVehiclesByBatteryRange(int minimumRange) {
        List<Vehicle> vehicles = vehicleRepository.findByBatteryRangeGreaterThanEqual(minimumRange);
        return convertVehiclesToDtos(vehicles);
    }

    @Override
    @Transactional
    public VehicleDto updateStatus(UUID vehicleId, VehicleStatus newStatus) {
        // Find the vehicle first
        Optional<Vehicle> vehicleOptional = vehicleRepository.findById(vehicleId);
        if (vehicleOptional.isEmpty()) {
            throw new EntityNotFoundException(vehicleId, Vehicle.class);
        }

        // Update the status and timestamp
        Vehicle vehicle = vehicleOptional.get();
        vehicle.setStatus(newStatus);
        vehicle.setUpdatedAt(dateMapper.asTimestamp(OffsetDateTime.now()));

        // Save and return the updated vehicle
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.vehicleToVehicleDto(savedVehicle);
    }

    @Override
    @Transactional
    public VehicleDto applyDiscount(UUID vehicleId, BigDecimal discountPercent) {
        // Find the vehicle first
        Optional<Vehicle> vehicleOptional = vehicleRepository.findById(vehicleId);
        if (vehicleOptional.isEmpty()) {
            throw new EntityNotFoundException(vehicleId, Vehicle.class);
        }

        // Apply the discount
        Vehicle vehicle = vehicleOptional.get();
        vehicle.setDiscountPercent(discountPercent);
        vehicle.setOnDeal(true);
        vehicle.setUpdatedAt(dateMapper.asTimestamp(OffsetDateTime.now()));

        // Save and return the updated vehicle
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.vehicleToVehicleDto(savedVehicle);
    }

    @Override
    @Transactional
    public VehicleDto removeDiscount(UUID vehicleId) {
        // Find the vehicle first
        Optional<Vehicle> vehicleOptional = vehicleRepository.findById(vehicleId);
        if (vehicleOptional.isEmpty()) {
            throw new EntityNotFoundException(vehicleId, Vehicle.class);
        }

        // Remove the discount
        Vehicle vehicle = vehicleOptional.get();
        vehicle.setDiscountPercent(null);
        vehicle.setOnDeal(false);
        vehicle.setUpdatedAt(dateMapper.asTimestamp(OffsetDateTime.now()));

        // Save and return the updated vehicle
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.vehicleToVehicleDto(savedVehicle);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getAvailableVehicleCount() {
        return vehicleRepository.countByStatus(VehicleStatus.AVAILABLE);
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getAveragePrice() {
        Optional<BigDecimal> averagePrice = vehicleRepository.findAveragePrice();

        if (averagePrice.isPresent()) {
            return averagePrice.get();
        } else {
            return BigDecimal.ZERO;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getMinPrice() {
        Optional<BigDecimal> minPrice = vehicleRepository.findMinPrice();

        if (minPrice.isPresent()) {
            return minPrice.get();
        } else {
            return BigDecimal.ZERO;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getMaxPrice() {
        Optional<BigDecimal> maxPrice = vehicleRepository.findMaxPrice();

        if (maxPrice.isPresent()) {
            return maxPrice.get();
        } else {
            return BigDecimal.ZERO;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleDto> searchVehicles(String searchKeyword) {
        // Get all vehicles first
        List<VehicleDto> allVehicles = getAllVehicles();
        List<VehicleDto> matchingVehicles = new ArrayList<>();

        // Make the search case-insensitive
        String lowercaseKeyword = searchKeyword.toLowerCase();

        // Check each vehicle to see if it matches the search
        for (VehicleDto vehicle : allVehicles) {
            boolean foundMatch = false;

            // Check if the model contains the keyword
            if (vehicle.getModel() != null) {
                String lowercaseModel = vehicle.getModel().toLowerCase();
                if (lowercaseModel.contains(lowercaseKeyword)) {
                    foundMatch = true;
                }
            }

            // Check if the description contains the keyword
            if (!foundMatch && vehicle.getDescription() != null) {
                String lowercaseDescription = vehicle.getDescription().toLowerCase();
                if (lowercaseDescription.contains(lowercaseKeyword)) {
                    foundMatch = true;
                }
            }

            // If we found a match, add it to our results
            if (foundMatch) {
                matchingVehicles.add(vehicle);
            }
        }

        return matchingVehicles;
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleDto> getLatestVehicles() {
        // Get all vehicles
        List<VehicleDto> allVehicles = getAllVehicles();
        List<VehicleDto> latestVehicles = new ArrayList<>();

        // For now, we'll just return the first 5 vehicles
        // In a real implementation, you'd sort by creation date
        int maxVehicles = 5;
        int count = 0;

        for (VehicleDto vehicle : allVehicles) {
            if (count >= maxVehicles) {
                break;
            }
            latestVehicles.add(vehicle);
            count++;
        }

        return latestVehicles;
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleDto> getVehiclesOnDeal() {
        // Get all vehicles and filter for ones on deal
        List<VehicleDto> allVehicles = getAllVehicles();
        List<VehicleDto> vehiclesOnDeal = new ArrayList<>();

        for (VehicleDto vehicle : allVehicles) {
            if (vehicle.isOnDeal()) {
                vehiclesOnDeal.add(vehicle);
            }
        }

        return vehiclesOnDeal;
    }

    // Helper method that does the conversion once, reused everywhere
    private List<VehicleDto> convertVehiclesToDtos(List<Vehicle> vehicles) {
        List<VehicleDto> vehicleDtos = new ArrayList<>();

        for (Vehicle vehicle : vehicles) {
            VehicleDto dto = vehicleMapper.vehicleToVehicleDto(vehicle);
            vehicleDtos.add(dto);
        }

        return vehicleDtos;
    }
}