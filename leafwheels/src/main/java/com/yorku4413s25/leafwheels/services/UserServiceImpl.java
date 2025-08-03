package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.constants.Role;
import com.yorku4413s25.leafwheels.domain.User;
import com.yorku4413s25.leafwheels.repositories.UserRepository;
import com.yorku4413s25.leafwheels.web.mappers.UserMapper;
import com.yorku4413s25.leafwheels.web.models.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserDto signup(String firstName, String lastName, String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        User user = User.builder()
                .role(Role.USER)
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .password(password) // Plaintext for dev only!
                .build();
        userRepository.save(user);

        return userMapper.userToUserDto(user);
    }

    public UserDto login(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> user.getPassword().equals(password))
                .map(userMapper::userToUserDto)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
    }

    public UserDto findById(UUID id) {
        return userRepository.findById(id)
                .map(userMapper::userToUserDto)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
