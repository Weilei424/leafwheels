package com.yorku4413s25.leafwheels.web.mappers;

import com.yorku4413s25.leafwheels.web.models.AccessoryDto;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AccessoryMapper {
    AccessoryDto accessoryDtoToAccessoryDto(AccessoryDto accessoryDto);
    AccessoryDto accessoryToAccessoryDto(AccessoryDto accessory);
    void accessoryDtoToAccessoryUpdate(AccessoryDto accessoryDto, @MappingTarget AccessoryDto existing);
}
