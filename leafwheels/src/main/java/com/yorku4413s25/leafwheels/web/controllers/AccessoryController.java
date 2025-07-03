package com.yorku4413s25.leafwheels.web.controllers;

import com.yorku4413s25.leafwheels.services.AccessoryService;
import com.yorku4413s25.leafwheels.web.models.AccessoryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/accessories")
@RequiredArgsConstructor
public class AccessoryController {

    private final AccessoryService accessoryService;

    @GetMapping("/all")
    public ResponseEntity<List<AccessoryDto>> getAllAccessories() {
        return new ResponseEntity<>(accessoryService.getAllAccessories(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccessoryDto> getAccessory(@PathVariable UUID id) {
        return new ResponseEntity<>(accessoryService.getAccessoryById(id), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<AccessoryDto> createAccessory(@RequestBody AccessoryDto dto) {
        return new ResponseEntity<>(accessoryService.createAccessory(dto), HttpStatus.CREATED);
    }

    //TODO: Implement update and delete methods
}
