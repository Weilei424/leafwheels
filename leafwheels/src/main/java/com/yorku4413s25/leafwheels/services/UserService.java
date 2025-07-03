package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.domain.User;
import com.yorku4413s25.leafwheels.web.models.UserDto;

import java.util.Optional;
import java.util.UUID;

public interface UserService {
    UserDto signup(String firstName, String lastName, String email, String password);
    UserDto login(String email, String password);
    UserDto findById(UUID id);
}
