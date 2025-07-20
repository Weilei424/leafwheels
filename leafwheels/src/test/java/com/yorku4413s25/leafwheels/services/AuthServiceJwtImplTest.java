package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.constants.Role;
import com.yorku4413s25.leafwheels.domain.User;
import com.yorku4413s25.leafwheels.repositories.UserRepository;
import com.yorku4413s25.leafwheels.security.CustomUserDetailsService;
import com.yorku4413s25.leafwheels.web.mappers.UserMapper;
import com.yorku4413s25.leafwheels.web.models.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceJwtImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserMapper userMapper;

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private ValueOperations<String, Object> valueOperations;

    @InjectMocks
    private AuthServiceJwtImpl authService;

    private User testUser;
    private SignupRequestDto signupRequest;
    private SigninRequestDto signinRequest;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(UUID.randomUUID())
                .email("test@example.com")
                .firstName("Test")
                .lastName("User")
                .password("encodedPassword")
                .role(Role.USER)
                .accountEnabled(true)
                .accountLocked(false)
                .accountExpired(false)
                .emailVerified(false)
                .failedLoginAttempts(0)
                .build();

        signupRequest = SignupRequestDto.builder()
                .firstName("Test")
                .lastName("User")
                .email("test@example.com")
                .password("password123")
                .confirmPassword("password123")
                .build();

        signinRequest = SigninRequestDto.builder()
                .email("test@example.com")
                .password("password123")
                .build();

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    void shouldSignupUserSuccessfully() {
        when(userRepository.findByEmail(signupRequest.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(signupRequest.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtService.generateAccessToken(any())).thenReturn("accessToken");
        when(jwtService.generateRefreshToken(any())).thenReturn("refreshToken");
        when(jwtService.getAccessTokenExpiration()).thenReturn(900000L);
        when(userMapper.toDto(testUser)).thenReturn(UserDto.builder().email("test@example.com").build());

        AuthResponseDto response = authService.signup(signupRequest);

        assertNotNull(response);
        assertEquals("accessToken", response.getAccessToken());
        assertEquals("refreshToken", response.getRefreshToken());
        assertEquals("Bearer", response.getTokenType());
        assertEquals(900000L, response.getExpiresIn());

        verify(userRepository).save(any(User.class));
        verify(valueOperations).set(eq("refresh_token:" + testUser.getId()), eq("refreshToken"), eq(7L), any());
    }

    @Test
    void shouldThrowExceptionWhenPasswordsDoNotMatch() {
        signupRequest.setConfirmPassword("differentPassword");

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, 
                () -> authService.signup(signupRequest));

        assertEquals("Passwords do not match", exception.getMessage());
    }

    @Test
    void shouldThrowExceptionWhenEmailAlreadyExists() {
        when(userRepository.findByEmail(signupRequest.getEmail())).thenReturn(Optional.of(testUser));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, 
                () -> authService.signup(signupRequest));

        assertEquals("Email already registered", exception.getMessage());
    }

    @Test
    void shouldSigninUserSuccessfully() {
        Authentication authentication = mock(Authentication.class);
        CustomUserDetailsService.UserPrincipal userPrincipal = 
                CustomUserDetailsService.UserPrincipal.create(testUser);

        when(userRepository.findByEmail(signinRequest.getEmail())).thenReturn(Optional.of(testUser));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(jwtService.generateAccessToken(userPrincipal)).thenReturn("accessToken");
        when(jwtService.generateRefreshToken(userPrincipal)).thenReturn("refreshToken");
        when(jwtService.getAccessTokenExpiration()).thenReturn(900000L);
        when(userMapper.toDto(testUser)).thenReturn(UserDto.builder().email("test@example.com").build());

        AuthResponseDto response = authService.signin(signinRequest);

        assertNotNull(response);
        assertEquals("accessToken", response.getAccessToken());
        assertEquals("refreshToken", response.getRefreshToken());

        verify(userRepository).save(testUser);
        assertEquals(0, testUser.getFailedLoginAttempts());
        assertNotNull(testUser.getLastLoginAt());
    }

    @Test
    void shouldThrowExceptionWhenAccountIsLocked() {
        testUser.setAccountLocked(true);
        when(userRepository.findByEmail(signinRequest.getEmail())).thenReturn(Optional.of(testUser));

        BadCredentialsException exception = assertThrows(BadCredentialsException.class, 
                () -> authService.signin(signinRequest));

        assertEquals("Account is locked due to too many failed login attempts", exception.getMessage());
    }

    @Test
    void shouldIncrementFailedAttemptsOnBadCredentials() {
        when(userRepository.findByEmail(signinRequest.getEmail())).thenReturn(Optional.of(testUser));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.signin(signinRequest));

        assertEquals(1, testUser.getFailedLoginAttempts());
        verify(userRepository).save(testUser);
    }

    @Test
    void shouldRefreshTokenSuccessfully() {
        RefreshTokenRequestDto refreshRequest = RefreshTokenRequestDto.builder()
                .refreshToken("validRefreshToken")
                .build();

        CustomUserDetailsService.UserPrincipal userPrincipal = 
                CustomUserDetailsService.UserPrincipal.create(testUser);

        when(jwtService.extractUsername("validRefreshToken")).thenReturn("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(valueOperations.get("refresh_token:" + testUser.getId())).thenReturn("validRefreshToken");
        when(jwtService.isTokenValid("validRefreshToken", userPrincipal)).thenReturn(true);
        when(jwtService.generateAccessToken(userPrincipal)).thenReturn("newAccessToken");
        when(jwtService.generateRefreshToken(userPrincipal)).thenReturn("newRefreshToken");
        when(jwtService.getAccessTokenExpiration()).thenReturn(900000L);
        when(userMapper.toDto(testUser)).thenReturn(UserDto.builder().email("test@example.com").build());

        AuthResponseDto response = authService.refreshToken(refreshRequest);

        assertNotNull(response);
        assertEquals("newAccessToken", response.getAccessToken());
        assertEquals("newRefreshToken", response.getRefreshToken());

        verify(redisTemplate).delete("refresh_token:" + testUser.getId());
        verify(valueOperations).set(eq("refresh_token:" + testUser.getId()), eq("newRefreshToken"), eq(7L), any());
    }

    @Test
    void shouldInitiatePasswordResetSuccessfully() {
        PasswordResetRequestDto resetRequest = PasswordResetRequestDto.builder()
                .email("test@example.com")
                .build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        assertDoesNotThrow(() -> authService.initiatePasswordReset(resetRequest));

        assertNotNull(testUser.getPasswordResetToken());
        assertNotNull(testUser.getPasswordResetExpiresAt());
        verify(userRepository).save(testUser);
    }

    @Test
    void shouldResetPasswordSuccessfully() {
        String resetToken = "validResetToken";
        testUser.setPasswordResetToken(resetToken);
        testUser.setPasswordResetExpiresAt(Instant.now().plusSeconds(3600)); // 1 hour

        PasswordResetDto resetDto = PasswordResetDto.builder()
                .token(resetToken)
                .newPassword("newPassword123")
                .confirmPassword("newPassword123")
                .build();

        when(userRepository.findByPasswordResetToken(resetToken)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.encode("newPassword123")).thenReturn("encodedNewPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        assertDoesNotThrow(() -> authService.resetPassword(resetDto));

        assertNull(testUser.getPasswordResetToken());
        assertNull(testUser.getPasswordResetExpiresAt());
        assertEquals(0, testUser.getFailedLoginAttempts());
        assertFalse(testUser.getAccountLocked());
        verify(userRepository).save(testUser);
    }
}