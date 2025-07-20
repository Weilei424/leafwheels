package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.constants.Role;
import com.yorku4413s25.leafwheels.domain.User;
import com.yorku4413s25.leafwheels.security.CustomUserDetailsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.TestPropertySource;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
        "jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970",
        "jwt.access-token-expiration=900000",
        "jwt.refresh-token-expiration=604800000",
        "jwt.issuer=leafwheels-test"
})
class JwtServiceTest {

    @Autowired
    private JwtService jwtService;

    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        User user = User.builder()
                .id(UUID.randomUUID())
                .email("test@example.com")
                .firstName("Test")
                .lastName("User")
                .password("password")
                .role(Role.USER)
                .accountEnabled(true)
                .accountLocked(false)
                .accountExpired(false)
                .build();

        userDetails = CustomUserDetailsService.UserPrincipal.create(user);
    }

    @Test
    void shouldGenerateAccessToken() {
        String token = jwtService.generateAccessToken(userDetails);

        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.split("\\.").length == 3); // JWT should have 3 parts
    }

    @Test
    void shouldGenerateRefreshToken() {
        String token = jwtService.generateRefreshToken(userDetails);

        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.split("\\.").length == 3);
    }

    @Test
    void shouldExtractUsernameFromToken() {
        String token = jwtService.generateAccessToken(userDetails);

        String extractedUsername = jwtService.extractUsername(token);

        assertEquals(userDetails.getUsername(), extractedUsername);
    }

    @Test
    void shouldValidateTokenSuccessfully() {
        String token = jwtService.generateAccessToken(userDetails);

        boolean isValid = jwtService.isTokenValid(token, userDetails);

        assertTrue(isValid);
    }

    @Test
    void shouldReturnFalseForInvalidToken() {
        String invalidToken = "invalid.token.here";

        assertThrows(Exception.class, () -> {
            jwtService.isTokenValid(invalidToken, userDetails);
        });
    }

    @Test
    void shouldReturnCorrectTokenExpirations() {
        long accessExpiration = jwtService.getAccessTokenExpiration();
        long refreshExpiration = jwtService.getRefreshTokenExpiration();

        assertEquals(900000L, accessExpiration);
        assertEquals(604800000L, refreshExpiration);
    }
}