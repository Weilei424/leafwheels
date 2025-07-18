package com.yorku4413s25.leafwheels.repositories;

import com.yorku4413s25.leafwheels.constants.Make;
import com.yorku4413s25.leafwheels.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByUserId(UUID userId);
    List<Review> findByMakeAndModel(Make make, String model);
    boolean existsByUserIdAndMakeAndModel(UUID userId, Make make, String model);
    
    @Query("SELECT r FROM Review r WHERE r.make = :make AND LOWER(r.model) = LOWER(:model)")
    List<Review> findByMakeAndModelIgnoreCase(@Param("make") Make make, @Param("model") String model);
    
    @Query("SELECT COUNT(r) > 0 FROM Review r WHERE r.userId = :userId AND r.make = :make AND LOWER(r.model) = LOWER(:model)")
    boolean existsByUserIdAndMakeAndModelIgnoreCase(@Param("userId") UUID userId, @Param("make") Make make, @Param("model") String model);
}
