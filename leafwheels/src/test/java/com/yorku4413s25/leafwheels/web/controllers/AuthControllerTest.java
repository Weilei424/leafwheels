package com.yorku4413s25.leafwheels.web.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yorku4413s25.leafwheels.constants.Role;
import com.yorku4413s25.leafwheels.services.UserService;
import com.yorku4413s25.leafwheels.web.models.LoginRequestDto;
import com.yorku4413s25.leafwheels.web.models.UserDto;
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
    private UserService userService;

    private AuthController authController;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        authController = new AuthController(userService);
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void devSignupShouldReturnUserWhenValidInput() throws Exception {
        UserDto inputDto = createSampleUserDto();
        UserDto createdUser = createSampleUserDto();
        createdUser.setId(UUID.randomUUID());

        when(userService.signup(
                eq(inputDto.getFirstName()),
                eq(inputDto.getLastName()),
                eq(inputDto.getEmail()),
                eq(inputDto.getPassword())
        )).thenReturn(createdUser);

        mockMvc.perform(post("/api/v1/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.firstName").value(createdUser.getFirstName()))
                .andExpect(jsonPath("$.lastName").value(createdUser.getLastName()))
                .andExpect(jsonPath("$.email").value(createdUser.getEmail()));

        verify(userService).signup(
                eq(inputDto.getFirstName()),
                eq(inputDto.getLastName()),
                eq(inputDto.getEmail()),
                eq(inputDto.getPassword())
        );
    }

    @Test
    void devLoginShouldReturnUserWhenValidCredentials() throws Exception {
        LoginRequestDto loginRequest = new LoginRequestDto("john.doe@example.com", "password123");
        UserDto authenticatedUser = createSampleUserDto();
        authenticatedUser.setId(UUID.randomUUID());

        when(userService.login(
                eq(loginRequest.getEmail()),
                eq(loginRequest.getPassword())
        )).thenReturn(authenticatedUser);

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value(authenticatedUser.getFirstName()))
                .andExpect(jsonPath("$.lastName").value(authenticatedUser.getLastName()))
                .andExpect(jsonPath("$.email").value(authenticatedUser.getEmail()));

        verify(userService).login(
                eq(loginRequest.getEmail()),
                eq(loginRequest.getPassword())
        );
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