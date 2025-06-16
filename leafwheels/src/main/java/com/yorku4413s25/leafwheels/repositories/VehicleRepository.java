package com.yorku4413s25.leafwheels.repositories;

import com.yorku4413s25.leafwheels.domain.Vehicle;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.UUID;

public interface VehicleRepository extends PagingAndSortingRepository<Vehicle, UUID> {
}
