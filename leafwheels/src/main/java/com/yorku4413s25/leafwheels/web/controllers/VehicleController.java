package com.yorku4413s25.leafwheels.web.controllers;

import com.yorku4413s25.leafwheels.constants.BodyType;
import com.yorku4413s25.leafwheels.constants.Condition;
import com.yorku4413s25.leafwheels.constants.Make;
import com.yorku4413s25.leafwheels.constants.VehicleStatus;
import com.yorku4413s25.leafwheels.web.models.VehicleDto;
import com.yorku4413s25.leafwheels.services.VehicleService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/vehicles")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class VehicleController {

    private final VehicleService vehicleService;


    // TEST END POINT FOR FRONTEND.
    @GetMapping("/test")
    public ResponseEntity<String> testConnection() {
        log.debug("Test endpoint called");
        return ResponseEntity.ok("Hello World from Backend!");
    }




    // CONTROLLERS START FROM HERE
    @GetMapping
    public ResponseEntity<List<VehicleDto>> getAllVehicles(
            @RequestParam(defaultValue = "false") boolean availableOnly) {
        log.debug("Getting all vehicles, availableOnly: {}", availableOnly);
        List<VehicleDto> vehicles = availableOnly ?
                vehicleService.getAvailableVehicles() :
                vehicleService.getAllVehicles();
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleDto> getVehicleById(@PathVariable UUID id) {
        log.debug("Getting vehicle by id: {}", id);
        return ResponseEntity.ok(vehicleService.getById(id));
    }

    @GetMapping("/latest")
    public ResponseEntity<List<VehicleDto>> getLatestVehicles() {
        log.debug("Getting latest vehicles");
        return ResponseEntity.ok(vehicleService.getLatestVehicles());
    }

    @GetMapping("/deals")
    public ResponseEntity<List<VehicleDto>> getVehiclesOnDeal() {
        log.debug("Getting vehicles on deal");
        return ResponseEntity.ok(vehicleService.getVehiclesOnDeal());
    }

    @GetMapping("/search")
    public ResponseEntity<List<VehicleDto>> searchVehicles(@RequestParam String keyword) {
        log.debug("Searching vehicles with keyword: {}", keyword);
        return ResponseEntity.ok(vehicleService.searchVehicles(keyword));
    }

    @GetMapping("/make/{make}")
    public ResponseEntity<List<VehicleDto>> getVehiclesByMake(@PathVariable Make make) {
        log.debug("Getting vehicles by make: {}", make);
        return ResponseEntity.ok(vehicleService.getVehiclesByMake(make));
    }

    @GetMapping("/body-type/{bodyType}")
    public ResponseEntity<List<VehicleDto>> getVehiclesByBodyType(@PathVariable BodyType bodyType) {
        log.debug("Getting vehicles by body type: {}", bodyType);
        return ResponseEntity.ok(vehicleService.getVehiclesByBodyType(bodyType));
    }

    @GetMapping("/condition/{condition}")
    public ResponseEntity<List<VehicleDto>> getVehiclesByCondition(@PathVariable Condition condition) {
        log.debug("Getting vehicles by condition: {}", condition);
        return ResponseEntity.ok(vehicleService.getVehiclesByCondition(condition));
    }

    @GetMapping("/price")
    public ResponseEntity<List<VehicleDto>> getVehiclesByPriceRange(
            @RequestParam BigDecimal min,
            @RequestParam BigDecimal max) {
        log.debug("Getting vehicles by price range: {} - {}", min, max);
        return ResponseEntity.ok(vehicleService.getVehiclesByPriceRange(min, max));
    }

    @GetMapping("/year")
    public ResponseEntity<List<VehicleDto>> getVehiclesByYearRange(
            @RequestParam int start,
            @RequestParam int end) {
        log.debug("Getting vehicles by year range: {} - {}", start, end);
        return ResponseEntity.ok(vehicleService.getVehiclesByYearRange(start, end));
    }

    @GetMapping("/battery-range")
    public ResponseEntity<List<VehicleDto>> getVehiclesByBatteryRange(@RequestParam int min) {
        log.debug("Getting vehicles by battery range: {} miles+", min);
        return ResponseEntity.ok(vehicleService.getVehiclesByBatteryRange(min));
    }

    @PostMapping
    public ResponseEntity<VehicleDto> createVehicle(@RequestBody VehicleDto vehicleDto) {
        log.debug("Creating vehicle: {}", vehicleDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(vehicleService.create(vehicleDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateVehicle(@PathVariable UUID id, @RequestBody VehicleDto vehicleDto) {
        log.debug("Updating vehicle {}: {}", id, vehicleDto);
        vehicleService.update(id, vehicleDto);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<VehicleDto> updateVehicleStatus(
            @PathVariable UUID id,
            @RequestParam VehicleStatus status) {
        log.debug("Updating vehicle {} status to {}", id, status);
        return ResponseEntity.ok(vehicleService.updateStatus(id, status));
    }

    @PatchMapping("/{id}/discount")
    public ResponseEntity<VehicleDto> applyDiscount(
            @PathVariable UUID id,
            @RequestParam BigDecimal discountPercent) {
        log.debug("Applying {}% discount to vehicle {}", discountPercent, id);
        return ResponseEntity.ok(vehicleService.applyDiscount(id, discountPercent));
    }

    @DeleteMapping("/{id}/discount")
    public ResponseEntity<VehicleDto> removeDiscount(@PathVariable UUID id) {
        log.debug("Removing discount from vehicle {}", id);
        return ResponseEntity.ok(vehicleService.removeDiscount(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable UUID id) {
        log.debug("Deleting vehicle: {}", id);
        vehicleService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getVehicleStats() {
        log.debug("Getting vehicle statistics");
        Map<String, Object> stats = Map.of(
                "totalAvailable", vehicleService.getAvailableVehicleCount(),
                "averagePrice", vehicleService.getAveragePrice(),
                "minPrice", vehicleService.getMinPrice(),
                "maxPrice", vehicleService.getMaxPrice()
        );
        return ResponseEntity.ok(stats);
    }
}