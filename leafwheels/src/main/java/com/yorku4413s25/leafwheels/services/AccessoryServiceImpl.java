package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.domain.Accessory;
import com.yorku4413s25.leafwheels.exception.EntityNotFoundException;
import com.yorku4413s25.leafwheels.repositories.AccessoryRepository;
import com.yorku4413s25.leafwheels.web.mappers.AccessoryMapper;
import com.yorku4413s25.leafwheels.web.models.AccessoryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccessoryServiceImpl implements AccessoryService {

    private final AccessoryRepository accessoryRepository;
    private final AccessoryMapper accessoryMapper;

    @Override
    @Transactional
    public List<AccessoryDto> getAllAccessories() {
        return accessoryRepository.findAll()
                .stream()
                .map(accessoryMapper::accessoryToAccessoryDto)
                .toList();
    }

    @Override
    @Transactional
    public AccessoryDto getAccessoryById(UUID id) {
        return accessoryMapper.accessoryToAccessoryDto(
                accessoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(id, Accessory.class)));
    }

    @Override
    @Transactional
    public AccessoryDto createAccessory(AccessoryDto dto) {
        Accessory accessory = accessoryMapper.accessoryDtoToAccessory(dto);
        accessory.setId(null); // Ensure a new ID is generated
        Accessory saved = accessoryRepository.save(accessory);
        return accessoryMapper.accessoryToAccessoryDto(saved);
    }
}
