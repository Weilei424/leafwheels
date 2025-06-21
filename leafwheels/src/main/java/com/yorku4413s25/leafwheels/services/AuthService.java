package com.yorku4413s25.leafwheels.services;
import com.yorku4413s25.leafwheels.domain.User;
import com.yorku4413s25.leafwheels.constants.Role;

import com.yorku4413s25.leafwheels.repositories.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {


    private UserRepository userRepository;
    private BCryptPasswordEncoder passwordEncoder;

    public String register(String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            return "Email already exists!";
        }

        User newUser = new User();
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setRole(Role.USER); // Default role

        userRepository.save(newUser);
        return "Registration successful!";
    }

    public String login(String email, String rawPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return "User not found";
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            return "Invalid password";
        }

        return "Login successful!";
    }
}