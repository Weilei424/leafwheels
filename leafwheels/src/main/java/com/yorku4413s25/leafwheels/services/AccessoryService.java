package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.web.models.AccessoryDto;

import java.util.List;
import java.util.UUID;

public interface AccessoryService {
    List<AccessoryDto> getAllAccessories();
    AccessoryDto getAccessoryById(UUID id);
    AccessoryDto createAccessory(AccessoryDto dto);
}
