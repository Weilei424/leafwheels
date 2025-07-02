package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.constants.Role;
import com.yorku4413s25.leafwheels.domain.User;
import com.yorku4413s25.leafwheels.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    // dev: no email verification, no hashing
    public User signup(String firstName, String lastName, String email, String password) {
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
        return userRepository.save(user);
    }

    // dev: plaintext password
    public Optional<User> login(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> user.getPassword().equals(password));
    }

    public Optional<User> findById(UUID id) {
        return userRepository.findById(id);
    }
}
