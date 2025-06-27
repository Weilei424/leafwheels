package com.yorku4413s25.leafwheels.repositories;

import com.yorku4413s25.leafwheels.domain.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, UUID>, JpaSpecificationExecutor<Vehicle> {

    @Query("SELECT DISTINCT v.model FROM Vehicle v WHERE v.model IS NOT NULL")
    List<String> findDistinctModels();

    @Query("SELECT DISTINCT v.exteriorColor FROM Vehicle v WHERE v.exteriorColor IS NOT NULL")
    List<String> findDistinctExteriorColor();

}
