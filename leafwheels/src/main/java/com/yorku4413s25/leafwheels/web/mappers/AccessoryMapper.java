package com.yorku4413s25.leafwheels.web.mappers;

import com.yorku4413s25.leafwheels.domain.Accessory;
import com.yorku4413s25.leafwheels.web.models.AccessoryDto;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AccessoryMapper {
    Accessory accessoryDtoToAccessory(AccessoryDto accessoryDto);
    AccessoryDto accessoryToAccessoryDto(Accessory accessory);
    void accessoryDtoToAccessoryUpdate(AccessoryDto accessoryDto, @MappingTarget Accessory existing);
}
