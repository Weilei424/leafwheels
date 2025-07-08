package com.yorku4413s25.leafwheels.repositories;

import com.yorku4413s25.leafwheels.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;


public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByUserId(UUID userId);
    List<Review> findByVehicleId(UUID vehicleId);
}
