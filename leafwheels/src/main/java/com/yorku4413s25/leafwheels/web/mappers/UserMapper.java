package com.yorku4413s25.leafwheels.web.mappers;

import com.yorku4413s25.leafwheels.domain.User;
import com.yorku4413s25.leafwheels.web.models.UserDto;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto userToUserDto(User user);
    User userDtoToUser(UserDto userDto);
    void userDtoToUserUpdate(UserDto userDto, @MappingTarget User existing);
}
