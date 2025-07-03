package com.yorku4413s25.leafwheels.web.controllers;

import com.yorku4413s25.leafwheels.services.AccessoryService;
import com.yorku4413s25.leafwheels.web.models.AccessoryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/accessories")
@RequiredArgsConstructor
public class AccessoryController {

    private final AccessoryService accessoryService;

    @GetMapping("/all")
    public List<AccessoryDto> getAllAccessories() {
        return accessoryService.getAllAccessories();
    }

    @GetMapping("/{id}")
    public AccessoryDto getAccessory(@PathVariable UUID id) {
        return accessoryService.getAccessoryById(id);
    }

    @PostMapping
    public AccessoryDto createAccessory(@RequestBody AccessoryDto dto) {
        return accessoryService.createAccessory(dto);
    }

    //TODO: Implement update and delete methods
}
