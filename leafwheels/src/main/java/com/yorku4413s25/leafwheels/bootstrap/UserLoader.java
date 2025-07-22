package com.yorku4413s25.leafwheels.bootstrap;

import com.yorku4413s25.leafwheels.constants.Role;
import com.yorku4413s25.leafwheels.services.AuthService;
import com.yorku4413s25.leafwheels.web.models.AuthResponseDto;
import com.yorku4413s25.leafwheels.web.models.SignupRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Order(2)
public class UserLoader implements CommandLineRunner {
    private final AuthService authService;

    @Override
    public void run(String... args) {
        // Check if any users exist by attempting to create them
        try {
            // Regular active users
            AuthResponseDto aliceResponse = authService.signup(SignupRequestDto.builder()
                    .firstName("Alice")
                    .lastName("Wang")
                    .email("alice@example.com")
                    .password("password123")
                    .confirmPassword("password123")
                    .build());
            System.out.println("Created Alice - Access Token: " + aliceResponse.getAccessToken());

            AuthResponseDto bobResponse = authService.signup(SignupRequestDto.builder()
                    .firstName("Bob")
                    .lastName("Lee")
                    .email("bob@example.com")
                    .password("password123")
                    .confirmPassword("password123")
                    .build());
            System.out.println("Created Bob - Access Token: " + bobResponse.getAccessToken());

            // User with unverified email (for testing email verification flow)
            AuthResponseDto carolResponse = authService.signup(SignupRequestDto.builder()
                    .firstName("Carol")
                    .lastName("Smith")
                    .email("carol@example.com")
                    .password("password123")
                    .confirmPassword("password123")
                    .build());
            System.out.println("Created Carol - Access Token: " + carolResponse.getAccessToken());

            // User with some failed attempts (for testing account lockout)
            AuthResponseDto davidResponse = authService.signup(SignupRequestDto.builder()
                    .firstName("David")
                    .lastName("Kim")
                    .email("david@example.com")
                    .password("password123")
                    .confirmPassword("password123")
                    .build());
            System.out.println("Created David - Access Token: " + davidResponse.getAccessToken());

            // Locked user account (for testing locked account handling)
            AuthResponseDto lockedResponse = authService.signup(SignupRequestDto.builder()
                    .firstName("Locked")
                    .lastName("User")
                    .email("locked@example.com")
                    .password("password123")
                    .confirmPassword("password123")
                    .build());
            System.out.println("Created Locked User - Access Token: " + lockedResponse.getAccessToken());

            // Admin users - will get non-expiring tokens
            AuthResponseDto admin1Response = authService.signupWithRole(SignupRequestDto.builder()
                    .firstName("Admin")
                    .lastName("Jones")
                    .email("admin1@example.com")
                    .password("adminpass")
                    .confirmPassword("adminpass")
                    .build(), Role.ADMIN);
            System.out.println("\n=== ADMIN ACCESS TOKENS (NON-EXPIRING) ===");
            System.out.println("Admin1 (admin1@example.com) - Access Token: " + admin1Response.getAccessToken());

            AuthResponseDto admin2Response = authService.signupWithRole(SignupRequestDto.builder()
                    .firstName("Super")
                    .lastName("Admin")
                    .email("admin2@example.com")
                    .password("adminpass")
                    .confirmPassword("adminpass")
                    .build(), Role.ADMIN);
            System.out.println("Admin2 (admin2@example.com) - Access Token: " + admin2Response.getAccessToken());
            System.out.println("=======================================\n");

            System.out.println("SUCCESS: Seeded 7 user records with proper JWT tokens.");
        } catch (Exception e) {
            System.out.println("FAILED: Users may already exist or error occurred: " + e.getMessage());
        }
    }
}
