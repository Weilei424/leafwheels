package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.domain.Vehicle;
import com.yorku4413s25.leafwheels.domain.VehicleHistory;
import com.yorku4413s25.leafwheels.exception.EntityNotFoundException;
import com.yorku4413s25.leafwheels.repositories.VehicleHistoryRepository;
import com.yorku4413s25.leafwheels.repositories.VehicleRepository;
import com.yorku4413s25.leafwheels.web.mappers.VehicleHistoryMapper;
import com.yorku4413s25.leafwheels.web.models.VehicleHistoryDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
@Transactional
public class VehicleHistoryServiceImpl implements VehicleHistoryService {

    private final VehicleHistoryRepository vehicleHistoryRepository;
    private final VehicleRepository vehicleRepository;
    private final VehicleHistoryMapper vehicleHistoryMapper;

    @Override
    public VehicleHistoryDto getById(UUID vehicleHistoryId) {
        return vehicleHistoryMapper.vehicleHistoryToVehicleHistoryDto(
                vehicleHistoryRepository.findById(vehicleHistoryId)
                        .orElseThrow(() -> new EntityNotFoundException(vehicleHistoryId, VehicleHistory.class))
        );
    }

    @Override
    public VehicleHistoryDto create(VehicleHistoryDto vehicleHistoryDto) {
        Vehicle vehicle = vehicleRepository.findById(vehicleHistoryDto.getVehicleId())
                .orElseThrow(() -> new EntityNotFoundException(vehicleHistoryDto.getVehicleId(), Vehicle.class));
        
        VehicleHistory vehicleHistory = vehicleHistoryMapper.vehicleHistoryDtoToVehicleHistory(vehicleHistoryDto);
        vehicleHistory.setVehicle(vehicle);
        
        return vehicleHistoryMapper.vehicleHistoryToVehicleHistoryDto(
                vehicleHistoryRepository.save(vehicleHistory)
        );
    }

    @Override
    public VehicleHistoryDto updateById(UUID vehicleHistoryId, VehicleHistoryDto vehicleHistoryDto) {
        VehicleHistory existing = vehicleHistoryRepository.findById(vehicleHistoryId)
                .orElseThrow(() -> new EntityNotFoundException(vehicleHistoryId, VehicleHistory.class));

        if (vehicleHistoryDto.getVehicleId() != null && 
            !vehicleHistoryDto.getVehicleId().equals(existing.getVehicle().getId())) {
            Vehicle vehicle = vehicleRepository.findById(vehicleHistoryDto.getVehicleId())
                    .orElseThrow(() -> new EntityNotFoundException(vehicleHistoryDto.getVehicleId(), Vehicle.class));
            existing.setVehicle(vehicle);
        }

        vehicleHistoryMapper.vehicleHistoryDtoToVehicleHistoryUpdate(vehicleHistoryDto, existing);
        return vehicleHistoryMapper.vehicleHistoryToVehicleHistoryDto(
                vehicleHistoryRepository.save(existing)
        );
    }

    @Override
    public void delete(UUID vehicleHistoryId) {
        if (!vehicleHistoryRepository.existsById(vehicleHistoryId)) {
            throw new EntityNotFoundException(vehicleHistoryId, VehicleHistory.class);
        }
        vehicleHistoryRepository.deleteById(vehicleHistoryId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleHistoryDto> getByVehicleId(UUID vehicleId) {
        if (!vehicleRepository.existsById(vehicleId)) {
            throw new EntityNotFoundException(vehicleId, Vehicle.class);
        }
        
        return vehicleHistoryRepository.findByVehicleId(vehicleId).stream()
                .map(vehicleHistoryMapper::vehicleHistoryToVehicleHistoryDto)
                .collect(Collectors.toList());
    }
}