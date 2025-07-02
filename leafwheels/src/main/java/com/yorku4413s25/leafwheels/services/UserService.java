package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.domain.User;

import java.util.Optional;
import java.util.UUID;

public interface UserService {
    User signup(String firstName, String lastName, String email, String password);
    Optional<User> login(String email, String password);
    Optional<User> findById(UUID id);
}
