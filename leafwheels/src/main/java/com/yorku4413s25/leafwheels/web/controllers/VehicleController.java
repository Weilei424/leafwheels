package com.yorku4413s25.leafwheels.web.controllers;

import com.yorku4413s25.leafwheels.constants.BodyType;
import com.yorku4413s25.leafwheels.constants.Condition;
import com.yorku4413s25.leafwheels.constants.Make;
import com.yorku4413s25.leafwheels.constants.VehicleStatus;
import com.yorku4413s25.leafwheels.services.VehicleService;
import com.yorku4413s25.leafwheels.web.models.VehicleDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RequestMapping("/api/v1/vehicle")
@AllArgsConstructor
@RestController
public class VehicleController {

    private VehicleService vehicleService;

    @Operation(summary = "Get a vehicle by ID", description = "Retrieve details of a vehicle by its UUID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle found", content = @Content(schema = @Schema(implementation = VehicleDto.class))),
            @ApiResponse(responseCode = "404", description = "Vehicle not found", content = @Content)
    })
    @GetMapping("/{vehicleId}")
    public ResponseEntity<VehicleDto> findVehicleById(@PathVariable UUID vehicleId) {
        return new ResponseEntity<>(vehicleService.getById(vehicleId), HttpStatus.OK);
    }

    @Operation(summary = "Create a new vehicle", description = "Add a new vehicle to the system.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Vehicle created", content = @Content(schema = @Schema(implementation = VehicleDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input", content = @Content)
    })
    @PostMapping
    public ResponseEntity<VehicleDto> createVehicle(@RequestBody VehicleDto vehicleDto) {
        return new ResponseEntity<>(vehicleService.create(vehicleDto), HttpStatus.CREATED);
    }

    @Operation(summary = "Update an existing vehicle", description = "Update the details of an existing vehicle by its UUID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle updated", content = @Content(schema = @Schema(implementation = VehicleDto.class))),
            @ApiResponse(responseCode = "404", description = "Vehicle not found", content = @Content)
    })
    @PutMapping("/{vehicleId}")
    public ResponseEntity<VehicleDto> updateVehicleById(@PathVariable UUID vehicleId,
                                                        @RequestBody VehicleDto vehicleDto) {
        return new ResponseEntity<>(vehicleService.updateById(vehicleId, vehicleDto), HttpStatus.OK);
    }

    @Operation(summary = "Delete a vehicle", description = "Delete a vehicle by its UUID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Vehicle deleted"),
            @ApiResponse(responseCode = "404", description = "Vehicle not found", content = @Content)
    })
    @DeleteMapping("/{vehicleId}")
    public ResponseEntity<Void> deleteVehicleById(@PathVariable UUID vehicleId) {
        vehicleService.delete(vehicleId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Get all vehicles", description = "Retrieve a list of all vehicles in the system.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicles found", content = @Content(schema = @Schema(implementation = VehicleDto.class)))
    })
    @GetMapping("/all")
    public ResponseEntity<List<VehicleDto>> getAllVehicles() {
        return new ResponseEntity<>(vehicleService.getAllVehicles(), HttpStatus.OK);
    }

    @Operation(
            summary = "Filter vehicles",
            description = "Filter vehicles by year, make, model, bodyType, color, doors, seats, mileage, battery range, price, deal status, condition, and status. Results are paginated."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Filtered vehicles found", content = @Content(schema = @Schema(implementation = VehicleDto.class)))
    })
    @GetMapping("/filter")
    public ResponseEntity<Page<VehicleDto>> filterVehicles(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Make make,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) BodyType bodyType,
            @RequestParam(required = false) String exteriorColor,
            @RequestParam(required = false) Integer doors,
            @RequestParam(required = false) Integer seats,
            @RequestParam(required = false) Integer minMileage,
            @RequestParam(required = false) Integer maxMileage,
            @RequestParam(required = false) Integer minBatteryRange,
            @RequestParam(required = false) Integer maxBatteryRange,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean onDeal,
            @RequestParam(required = false) Condition condition,
            @RequestParam(required = false) VehicleStatus status,
            Pageable pageable
    ) {
        return ResponseEntity.ok(vehicleService.filterVehicles(
                year, make, model, bodyType, exteriorColor, doors, seats,
                minMileage, maxMileage, minBatteryRange, maxBatteryRange,
                minPrice, maxPrice, onDeal, condition, status, pageable));
    }
}
