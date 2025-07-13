package com.yorku4413s25.leafwheels.repositories;

import com.yorku4413s25.leafwheels.domain.VehicleHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VehicleHistoryRepository extends JpaRepository<VehicleHistory, UUID> {
    List<VehicleHistory> findByVehicleId(UUID vehicleId);
}