package com.yorku4413s25.leafwheels.bootstrap;

import com.yorku4413s25.leafwheels.constants.Role;
import com.yorku4413s25.leafwheels.domain.User;
import com.yorku4413s25.leafwheels.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserLoader implements CommandLineRunner {
    private final UserRepository userRepository;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            userRepository.save(User.builder()
                    .role(Role.USER)
                    .firstName("Alice")
                    .lastName("Wang")
                    .email("alice@example.com")
                    .password("password123")
                    .build());

            userRepository.save(User.builder()
                    .role(Role.USER)
                    .firstName("Bob")
                    .lastName("Lee")
                    .email("bob@example.com")
                    .password("password123")
                    .build());

            userRepository.save(User.builder()
                    .role(Role.USER)
                    .firstName("Carol")
                    .lastName("Smith")
                    .email("carol@example.com")
                    .password("password123")
                    .build());

            userRepository.save(User.builder()
                    .role(Role.USER)
                    .firstName("David")
                    .lastName("Kim")
                    .email("david@example.com")
                    .password("password123")
                    .build());

            userRepository.save(User.builder()
                    .role(Role.ADMIN)
                    .firstName("Admin")
                    .lastName("Jones")
                    .email("admin1@example.com")
                    .password("adminpass")
                    .build());

            userRepository.save(User.builder()
                    .role(Role.ADMIN)
                    .firstName("Super")
                    .lastName("Admin")
                    .email("admin2@example.com")
                    .password("adminpass")
                    .build());

            System.out.println("Seeded 6 user records.");
        } else {
            System.out.println("User records already exist, skipping seeding.");
        }
    }
}
