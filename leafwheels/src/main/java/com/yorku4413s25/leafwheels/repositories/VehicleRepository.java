package com.yorku4413s25.leafwheels.repositories;

import com.yorku4413s25.leafwheels.domain.Vehicle;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
// PagingAndSortingRepository already includes everything CRUDRepository offers.
// public interface VehicleRepository extends PagingAndSortingRepository<Vehicle, UUID>, CrudRepository<Vehicle, UUID>
// -> public interface VehicleRepository extends PagingAndSortingRepository<Vehicle, UUID>
public interface VehicleRepository extends PagingAndSortingRepository<Vehicle, UUID> {

}
