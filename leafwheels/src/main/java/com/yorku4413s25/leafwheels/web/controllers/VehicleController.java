package com.yorku4413s25.leafwheels.web.controllers;

import com.yorku4413s25.leafwheels.services.VehicleService;
import com.yorku4413s25.leafwheels.web.models.VehicleDto;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequestMapping("/api/v1/vehicle")
@AllArgsConstructor
@RestController
public class VehicleController {

    private VehicleService vehicleService;

    @GetMapping("/{vehicleId}")
    public ResponseEntity<VehicleDto> findVehicleById(@PathVariable UUID vehicleId) {
        return new ResponseEntity<>(vehicleService.getById(vehicleId), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<VehicleDto> createVehicle(@RequestBody VehicleDto vehicleDto) {
        return new ResponseEntity<>(vehicleService.create(vehicleDto), HttpStatus.CREATED);
    }

    @PutMapping("/{vehicleId}")
    public ResponseEntity<VehicleDto> updateVehicleById(@PathVariable UUID vehicleId,
                                                        @RequestBody VehicleDto vehicleDto) {
        return new ResponseEntity<>(vehicleService.updateById(vehicleId, vehicleDto), HttpStatus.OK);
    }

    @DeleteMapping("/{vehicleId}")
    public ResponseEntity<Void> deleteVehicleById(@PathVariable UUID vehicleId) {
        vehicleService.delete(vehicleId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/all")
    public ResponseEntity<List<VehicleDto>> getAllVehicles() {
        return new ResponseEntity<>(vehicleService.getAllVehicles(), HttpStatus.OK);
    }
}
