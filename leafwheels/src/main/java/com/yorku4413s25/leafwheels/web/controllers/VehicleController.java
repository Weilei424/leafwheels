package com.yorku4413s25.leafwheels.web.controllers;

import com.yorku4413s25.leafwheels.constants.BodyType;
import com.yorku4413s25.leafwheels.constants.Condition;
import com.yorku4413s25.leafwheels.constants.Make;
import com.yorku4413s25.leafwheels.constants.VehicleStatus;
import com.yorku4413s25.leafwheels.services.VehicleService;
import com.yorku4413s25.leafwheels.web.models.VehicleDto;
import com.yorku4413s25.leafwheels.web.models.VehicleRequestDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import java.math.BigDecimal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RequestMapping("/api/v1/vehicle")
@AllArgsConstructor
@Tag(name = "Vehicle API", description = "Endpoints for managing vehicles with automatic discount calculation")
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

    @Operation(summary = "Create a new vehicle", description = "Add a new vehicle to the system. The discount system automatically calculates the final price and deal status based on either discount percentage or discount amount. Discount percentage represents the percentage off (e.g., 0.15 = 15% off) with discountPrice = originalPrice * (1 - discountPercentage). Discount amount represents a fixed dollar amount off (e.g., 5000.00 = $5000 off) with discountPrice = originalPrice - discountAmount. The onDeal flag is automatically set to true when either discountPercentage > 0 or discountAmount > 0. Note: discountAmount and discountPercentage cannot both be set simultaneously.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Vehicle created with automatic discount calculations", content = @Content(schema = @Schema(implementation = VehicleDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input", content = @Content)
    })
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VehicleDto> createVehicle(@RequestBody VehicleRequestDto vehicleRequestDto) {
        VehicleDto vehicleDto = convertToVehicleDto(vehicleRequestDto);
        validateDiscountMutualExclusivity(vehicleDto);
        return new ResponseEntity<>(vehicleService.create(vehicleDto), HttpStatus.CREATED);
    }

    @Operation(summary = "Update an existing vehicle", description = "Update the details of an existing vehicle by its UUID. The discount system automatically recalculates the final price and deal status based on any changes to the original price, discount percentage, or discount amount. Users cannot directly modify the discounted price or deal status as these are computed automatically. Note: discountAmount and discountPercentage cannot both be set simultaneously.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle updated with automatic discount recalculation", content = @Content(schema = @Schema(implementation = VehicleDto.class))),
            @ApiResponse(responseCode = "404", description = "Vehicle not found", content = @Content)
    })
    @PutMapping("/{vehicleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VehicleDto> updateVehicleById(@PathVariable UUID vehicleId,
                                                        @RequestBody VehicleRequestDto vehicleRequestDto) {
        VehicleDto vehicleDto = convertToVehicleDto(vehicleRequestDto);
        validateDiscountMutualExclusivity(vehicleDto);
        return new ResponseEntity<>(vehicleService.updateById(vehicleId, vehicleDto), HttpStatus.OK);
    }

    @Operation(summary = "Delete a vehicle", description = "Delete a vehicle by its UUID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Vehicle deleted"),
            @ApiResponse(responseCode = "404", description = "Vehicle not found", content = @Content)
    })
    @DeleteMapping("/{vehicleId}")
    @PreAuthorize("hasRole('ADMIN')")
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
            description = "Filter vehicles by year, make, model, bodyType, color, doors, seats, mileage, battery range, price, deal status, condition, status, and accident history. Results are paginated."
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
            @RequestParam(required = false) List<VehicleStatus> statuses,
            @RequestParam(required = false) Boolean hasAccidentHistory,
            Pageable pageable
    ) {
        return ResponseEntity.ok(vehicleService.filterVehicles(
                year, make, model, bodyType, exteriorColor, doors, seats,
                minMileage, maxMileage, minBatteryRange, maxBatteryRange,
                minPrice, maxPrice, onDeal, condition, statuses, hasAccidentHistory, pageable));
    }

    @Operation(summary = "Get vehicles by status", description = "Retrieve vehicles that match any of the specified statuses.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicles found", content = @Content(schema = @Schema(implementation = VehicleDto.class)))
    })
    @GetMapping("/by-status")
    public ResponseEntity<List<VehicleDto>> getVehiclesByStatus(
            @RequestParam List<VehicleStatus> statuses
    ) {
        return ResponseEntity.ok(vehicleService.getVehiclesByStatus(statuses));
    }

    @Operation(summary = "Get vehicles excluding specific statuses", description = "Retrieve vehicles that do not match any of the specified statuses.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicles found", content = @Content(schema = @Schema(implementation = VehicleDto.class)))
    })
    @GetMapping("/excluding-status")
    public ResponseEntity<List<VehicleDto>> getVehiclesExcludingStatus(
            @RequestParam List<VehicleStatus> excludedStatuses
    ) {
        return ResponseEntity.ok(vehicleService.getVehiclesExcludingStatus(excludedStatuses));
    }

    @Operation(summary = "Get available vehicles", description = "Retrieve vehicles that are available for purchase (AVAILABLE, DEMO, INCOMING statuses only).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Available vehicles found", content = @Content(schema = @Schema(implementation = VehicleDto.class)))
    })
    @GetMapping("/available")
    public ResponseEntity<List<VehicleDto>> getAvailableVehicles() {
        return ResponseEntity.ok(vehicleService.getAvailableVehicles());
    }

    @Operation(summary = "Add image URLs to a vehicle", description = "Add one or more image URLs to an existing vehicle.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Image URLs added successfully", content = @Content(schema = @Schema(implementation = VehicleDto.class))),
            @ApiResponse(responseCode = "404", description = "Vehicle not found", content = @Content)
    })
    @PostMapping("/{vehicleId}/images")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VehicleDto> addImageUrls(
            @PathVariable UUID vehicleId,
            @RequestBody List<String> imageUrls) {
        return ResponseEntity.ok(vehicleService.addImageUrls(vehicleId, imageUrls));
    }

    private VehicleDto convertToVehicleDto(VehicleRequestDto requestDto) {
        return VehicleDto.builder()
                .id(requestDto.getId())
                .year(requestDto.getYear())
                .make(requestDto.getMake())
                .model(requestDto.getModel())
                .bodyType(requestDto.getBodyType())
                .exteriorColor(requestDto.getExteriorColor())
                .doors(requestDto.getDoors())
                .seats(requestDto.getSeats())
                .mileage(requestDto.getMileage())
                .batteryRange(requestDto.getBatteryRange())
                .trim(requestDto.getTrim())
                .price(requestDto.getPrice())
                .discountPercentage(requestDto.getDiscountPercentage() != null ? requestDto.getDiscountPercentage() : BigDecimal.ZERO)
                .discountAmount(requestDto.getDiscountAmount() != null ? requestDto.getDiscountAmount() : BigDecimal.ZERO)
                .vin(requestDto.getVin())
                .condition(requestDto.getCondition())
                .description(requestDto.getDescription())
                .status(requestDto.getStatus())
                .imageUrls(requestDto.getImageUrls())
                .build();
    }

    private void validateDiscountMutualExclusivity(VehicleDto dto) {
        if (dto.getDiscountAmount() != null && dto.getDiscountAmount().compareTo(BigDecimal.ZERO) > 0 &&
            dto.getDiscountPercentage() != null && dto.getDiscountPercentage().compareTo(BigDecimal.ZERO) > 0) {
            throw new IllegalStateException("Vehicle cannot have both discountAmount and discountPercentage set");
        }
    }
}
