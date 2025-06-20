package com.yorku4413s25.leafwheels.repositories;

import com.yorku4413s25.leafwheels.constants.BodyType;
import com.yorku4413s25.leafwheels.constants.Condition;
import com.yorku4413s25.leafwheels.constants.Make;
import com.yorku4413s25.leafwheels.constants.VehicleStatus;
import com.yorku4413s25.leafwheels.domain.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {

    // Find by status
    List<Vehicle> findByStatus(VehicleStatus status);
    List<Vehicle> findByStatusOrderByCreatedAtDesc(VehicleStatus status);

    // Find by make
    List<Vehicle> findByMake(Make make);
    List<Vehicle> findByMakeAndStatus(Make make, VehicleStatus status);

    // Find by body type
    List<Vehicle> findByBodyType(BodyType bodyType);
    List<Vehicle> findByBodyTypeAndStatus(BodyType bodyType, VehicleStatus status);

    // Find by condition
    List<Vehicle> findByCondition(Condition condition);
    List<Vehicle> findByConditionAndStatus(Condition condition, VehicleStatus status);

    // Find vehicles on deal
    List<Vehicle> findByOnDealTrue();
    List<Vehicle> findByOnDealTrueAndStatus(VehicleStatus status);

    // Price range
    List<Vehicle> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    List<Vehicle> findByPriceBetweenAndStatus(BigDecimal minPrice, BigDecimal maxPrice, VehicleStatus status);
    List<Vehicle> findByPriceLessThanEqual(BigDecimal maxPrice);
    List<Vehicle> findByPriceGreaterThanEqual(BigDecimal minPrice);

    // Year range
    List<Vehicle> findByYearBetween(int startYear, int endYear);
    List<Vehicle> findByYearBetweenAndStatus(int startYear, int endYear, VehicleStatus status);

    // Battery range (for electric vehicles)
    List<Vehicle> findByBatteryRangeGreaterThanEqual(int minRange);
    List<Vehicle> findByBatteryRangeBetween(int minRange, int maxRange);

    // Mileage
    List<Vehicle> findByMileageLessThanEqual(int maxMileage);
    List<Vehicle> findByMileageLessThanEqualAndStatus(int maxMileage, VehicleStatus status);

    // Search by keyword
    @Query("SELECT v FROM Vehicle v WHERE " +
           "LOWER(v.make) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(v.model) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(v.trim) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(v.exteriorColor) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(v.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Vehicle> searchByKeyword(@Param("keyword") String keyword);

    // Get latest vehicles
    List<Vehicle> findTop10ByStatusOrderByCreatedAtDesc(VehicleStatus status);

    // Get featured vehicles (new and on deal)
    @Query("SELECT v FROM Vehicle v WHERE v.status = 'AVAILABLE' AND (v.condition = 'NEW' OR v.onDeal = true) ORDER BY v.createdAt DESC")
    List<Vehicle> findFeaturedVehicles();

    // Statistics
    long countByStatus(VehicleStatus status);

    @Query("SELECT AVG(v.price) FROM Vehicle v")
    Optional<BigDecimal> findAveragePrice();
    
    @Query("SELECT MIN(v.price) FROM Vehicle v")
    Optional<BigDecimal> findMinPrice();
    
    @Query("SELECT MAX(v.price) FROM Vehicle v")
    Optional<BigDecimal> findMaxPrice();
}