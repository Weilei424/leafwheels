package com.yorku4413s25.leafwheels.repositories;

import com.yorku4413s25.leafwheels.constants.Make;
import com.yorku4413s25.leafwheels.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByUserId(UUID userId);
    List<Review> findByMakeAndModel(Make make, String model);
    boolean existsByUserIdAndMakeAndModel(UUID userId, Make make, String model);
}
