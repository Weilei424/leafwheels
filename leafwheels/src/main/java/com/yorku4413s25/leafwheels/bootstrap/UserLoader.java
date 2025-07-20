package com.yorku4413s25.leafwheels.bootstrap;

import com.yorku4413s25.leafwheels.constants.Role;
import com.yorku4413s25.leafwheels.domain.User;
import com.yorku4413s25.leafwheels.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Order(2)
public class UserLoader implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            // Regular active users
            userRepository.save(User.builder()
                    .role(Role.USER)
                    .firstName("Alice")
                    .lastName("Wang")
                    .email("alice@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .accountEnabled(true)
                    .accountLocked(false)
                    .accountExpired(false)
                    .emailVerified(true)
                    .failedLoginAttempts(0)
                    .build());

            userRepository.save(User.builder()
                    .role(Role.USER)
                    .firstName("Bob")
                    .lastName("Lee")
                    .email("bob@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .accountEnabled(true)
                    .accountLocked(false)
                    .accountExpired(false)
                    .emailVerified(true)
                    .failedLoginAttempts(0)
                    .build());

            // User with unverified email (for testing email verification flow)
            userRepository.save(User.builder()
                    .role(Role.USER)
                    .firstName("Carol")
                    .lastName("Smith")
                    .email("carol@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .accountEnabled(true)
                    .accountLocked(false)
                    .accountExpired(false)
                    .emailVerified(false)
                    .failedLoginAttempts(0)
                    .build());

            // User with some failed attempts (for testing account lockout)
            userRepository.save(User.builder()
                    .role(Role.USER)
                    .firstName("David")
                    .lastName("Kim")
                    .email("david@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .accountEnabled(true)
                    .accountLocked(false)
                    .accountExpired(false)
                    .emailVerified(true)
                    .failedLoginAttempts(3)
                    .build());

            // Locked user account (for testing locked account handling)
            userRepository.save(User.builder()
                    .role(Role.USER)
                    .firstName("Locked")
                    .lastName("User")
                    .email("locked@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .accountEnabled(true)
                    .accountLocked(true)
                    .accountExpired(false)
                    .emailVerified(true)
                    .failedLoginAttempts(5)
                    .build());

            // Admin users
            userRepository.save(User.builder()
                    .role(Role.ADMIN)
                    .firstName("Admin")
                    .lastName("Jones")
                    .email("admin1@example.com")
                    .password(passwordEncoder.encode("adminpass"))
                    .accountEnabled(true)
                    .accountLocked(false)
                    .accountExpired(false)
                    .emailVerified(true)
                    .failedLoginAttempts(0)
                    .build());

            userRepository.save(User.builder()
                    .role(Role.ADMIN)
                    .firstName("Super")
                    .lastName("Admin")
                    .email("admin2@example.com")
                    .password(passwordEncoder.encode("adminpass"))
                    .accountEnabled(true)
                    .accountLocked(false)
                    .accountExpired(false)
                    .emailVerified(true)
                    .failedLoginAttempts(0)
                    .build());

            System.out.println("Seeded 7 user records with various account states for testing.");
        } else {
            System.out.println("User records already exist, skipping seeding.");
        }
    }
}
