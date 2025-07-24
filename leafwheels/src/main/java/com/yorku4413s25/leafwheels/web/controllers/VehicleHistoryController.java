package com.yorku4413s25.leafwheels.web.controllers;

import com.yorku4413s25.leafwheels.services.VehicleHistoryService;
import com.yorku4413s25.leafwheels.web.models.VehicleHistoryDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RequestMapping("/api/v1/vehiclehistory")
@AllArgsConstructor
@Tag(name = "Vehicle History API", description = "Endpoints for managing vehicle history records")
@RestController
public class VehicleHistoryController {

    private final VehicleHistoryService vehicleHistoryService;

    @Operation(summary = "Get vehicle history by ID", description = "Retrieve details of a vehicle history record by its UUID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle history found", content = @Content(schema = @Schema(implementation = VehicleHistoryDto.class))),
            @ApiResponse(responseCode = "404", description = "Vehicle history not found", content = @Content)
    })
    @GetMapping("/{vehicleHistoryId}")
    public ResponseEntity<VehicleHistoryDto> findVehicleHistoryById(@PathVariable UUID vehicleHistoryId) {
        return new ResponseEntity<>(vehicleHistoryService.getById(vehicleHistoryId), HttpStatus.OK);
    }

    @Operation(summary = "Create a new vehicle history", description = "Add a new vehicle history record to the system.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Vehicle history created", content = @Content(schema = @Schema(implementation = VehicleHistoryDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input", content = @Content),
            @ApiResponse(responseCode = "404", description = "Vehicle not found", content = @Content)
    })
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VehicleHistoryDto> createVehicleHistory(@RequestBody @Valid VehicleHistoryDto vehicleHistoryDto) {
        return new ResponseEntity<>(vehicleHistoryService.create(vehicleHistoryDto), HttpStatus.CREATED);
    }

    @Operation(summary = "Update an existing vehicle history", description = "Update the details of an existing vehicle history record by its UUID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle history updated", content = @Content(schema = @Schema(implementation = VehicleHistoryDto.class))),
            @ApiResponse(responseCode = "404", description = "Vehicle history not found", content = @Content)
    })
    @PutMapping("/{vehicleHistoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VehicleHistoryDto> updateVehicleHistoryById(@PathVariable UUID vehicleHistoryId,
                                                                      @RequestBody @Valid VehicleHistoryDto vehicleHistoryDto) {
        return new ResponseEntity<>(vehicleHistoryService.updateById(vehicleHistoryId, vehicleHistoryDto), HttpStatus.OK);
    }

    @Operation(summary = "Delete a vehicle history", description = "Delete a vehicle history record by its UUID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Vehicle history deleted"),
            @ApiResponse(responseCode = "404", description = "Vehicle history not found", content = @Content)
    })
    @DeleteMapping("/{vehicleHistoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteVehicleHistoryById(@PathVariable UUID vehicleHistoryId) {
        vehicleHistoryService.delete(vehicleHistoryId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Get vehicle history by vehicle ID", description = "Retrieve all vehicle history records for a specific vehicle.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle history records found", content = @Content(schema = @Schema(implementation = VehicleHistoryDto.class))),
            @ApiResponse(responseCode = "404", description = "Vehicle not found", content = @Content)
    })
    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<VehicleHistoryDto>> getVehicleHistoryByVehicleId(@PathVariable UUID vehicleId) {
        return new ResponseEntity<>(vehicleHistoryService.getByVehicleId(vehicleId), HttpStatus.OK);
    }
}