package com.yorku4413s25.leafwheels.web.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yorku4413s25.leafwheels.constants.Role;
import com.yorku4413s25.leafwheels.services.AuthService;
import com.yorku4413s25.leafwheels.services.UserService;
import com.yorku4413s25.leafwheels.web.models.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthService authService;

    @Mock
    private UserService userService;

    private AuthController authController;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        authController = new AuthController(authService, userService);
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void signupShouldReturnJwtTokensWhenValidInput() throws Exception {
        SignupRequestDto signupRequest = SignupRequestDto.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .password("password123")
                .confirmPassword("password123")
                .build();

        AuthResponseDto authResponse = AuthResponseDto.builder()
                .accessToken("accessToken")
                .refreshToken("refreshToken")
                .tokenType("Bearer")
                .expiresIn(900000L)
                .user(createSampleUserDto())
                .build();

        when(authService.signup(any(SignupRequestDto.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/v1/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").value("accessToken"))
                .andExpect(jsonPath("$.refreshToken").value("refreshToken"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.expiresIn").value(900000L))
                .andExpect(jsonPath("$.user.email").value("john.doe@example.com"));

        verify(authService).signup(any(SignupRequestDto.class));
    }

    @Test
    void signinShouldReturnJwtTokensWhenValidCredentials() throws Exception {
        SigninRequestDto signinRequest = SigninRequestDto.builder()
                .email("john.doe@example.com")
                .password("password123")
                .build();

        AuthResponseDto authResponse = AuthResponseDto.builder()
                .accessToken("accessToken")
                .refreshToken("refreshToken")
                .tokenType("Bearer")
                .expiresIn(900000L)
                .user(createSampleUserDto())
                .build();

        when(authService.signin(any(SigninRequestDto.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/v1/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signinRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("accessToken"))
                .andExpect(jsonPath("$.refreshToken").value("refreshToken"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"));

        verify(authService).signin(any(SigninRequestDto.class));
    }

    @Test
    void refreshTokenShouldReturnNewTokens() throws Exception {
        RefreshTokenRequestDto refreshRequest = RefreshTokenRequestDto.builder()
                .refreshToken("validRefreshToken")
                .build();

        AuthResponseDto authResponse = AuthResponseDto.builder()
                .accessToken("newAccessToken")
                .refreshToken("newRefreshToken")
                .tokenType("Bearer")
                .expiresIn(900000L)
                .user(createSampleUserDto())
                .build();

        when(authService.refreshToken(any(RefreshTokenRequestDto.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/v1/auth/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(refreshRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("newAccessToken"))
                .andExpect(jsonPath("$.refreshToken").value("newRefreshToken"));

        verify(authService).refreshToken(any(RefreshTokenRequestDto.class));
    }

    @Test
    void signoutShouldSucceed() throws Exception {
        RefreshTokenRequestDto signoutRequest = RefreshTokenRequestDto.builder()
                .refreshToken("validRefreshToken")
                .build();

        doNothing().when(authService).signout("validRefreshToken");

        mockMvc.perform(post("/api/v1/auth/signout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signoutRequest)))
                .andExpect(status().isOk());

        verify(authService).signout("validRefreshToken");
    }

    @Test
    void forgotPasswordShouldSucceed() throws Exception {
        PasswordResetRequestDto resetRequest = PasswordResetRequestDto.builder()
                .email("john.doe@example.com")
                .build();

        doNothing().when(authService).initiatePasswordReset(any(PasswordResetRequestDto.class));

        mockMvc.perform(post("/api/v1/auth/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(resetRequest)))
                .andExpect(status().isOk());

        verify(authService).initiatePasswordReset(any(PasswordResetRequestDto.class));
    }

    @Test
    void resetPasswordShouldSucceed() throws Exception {
        PasswordResetDto resetDto = PasswordResetDto.builder()
                .token("validToken")
                .newPassword("newPassword123")
                .confirmPassword("newPassword123")
                .build();

        doNothing().when(authService).resetPassword(any(PasswordResetDto.class));

        mockMvc.perform(post("/api/v1/auth/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(resetDto)))
                .andExpect(status().isOk());

        verify(authService).resetPassword(any(PasswordResetDto.class));
    }

    private UserDto createSampleUserDto() {
        return UserDto.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .password("password123")
                .role(Role.USER)
                .build();
    }
}
