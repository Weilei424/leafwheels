package com.yorku4413s25.leafwheels.web.controllers;

import com.yorku4413s25.leafwheels.services.AuthService;
import com.yorku4413s25.leafwheels.services.UserService;
import com.yorku4413s25.leafwheels.web.models.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "JWT-based authentication endpoints for user registration, login, and token management")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @Operation(
            summary = "Register a new user",
            description = "Creates a new user account and returns JWT tokens"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User registered successfully",
                    content = @Content(schema = @Schema(implementation = AuthResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input or email already exists",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/signup")
    public ResponseEntity<AuthResponseDto> signup(@Valid @RequestBody SignupRequestDto request) {
        AuthResponseDto response = authService.signup(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(
            summary = "Sign in user",
            description = "Authenticates user and returns JWT tokens"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Sign in successful",
                    content = @Content(schema = @Schema(implementation = AuthResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "Invalid credentials",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/signin")
    public ResponseEntity<AuthResponseDto> signin(@Valid @RequestBody SigninRequestDto request) {
        AuthResponseDto response = authService.signin(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(
            summary = "Refresh access token",
            description = "Generates new access and refresh tokens using valid refresh token"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token refreshed successfully",
                    content = @Content(schema = @Schema(implementation = AuthResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "Invalid or expired refresh token",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDto> refreshToken(@Valid @RequestBody RefreshTokenRequestDto request) {
        AuthResponseDto response = authService.refreshToken(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(
            summary = "Sign out user",
            description = "Invalidates refresh token and signs out user"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Signed out successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid refresh token",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/signout")
    public ResponseEntity<Void> signout(@Valid @RequestBody RefreshTokenRequestDto request) {
        authService.signout(request.getRefreshToken());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(
            summary = "Initiate password reset",
            description = "Sends password reset token to user's email"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password reset initiated"),
            @ApiResponse(responseCode = "404", description = "User not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody PasswordResetRequestDto request) {
        authService.initiatePasswordReset(request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(
            summary = "Reset password",
            description = "Resets user password using reset token"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password reset successful"),
            @ApiResponse(responseCode = "400", description = "Invalid or expired token",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody PasswordResetDto request) {
        authService.resetPassword(request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

//    @Operation(
//            summary = "Login a user (dev only)",
//            description = "Development endpoint - accepts email and password as JSON. Returns user details if successful."
//    )
//    @ApiResponses(value = {
//            @ApiResponse(responseCode = "200", description = "Login successful",
//                    content = @Content(schema = @Schema(implementation = UserDto.class))),
//            @ApiResponse(responseCode = "400", description = "Invalid credentials",
//                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
//    })
//    @PostMapping("/dev/login")
//    public ResponseEntity<UserDto> devLogin(@RequestBody LoginRequestDto request) {
//        return new ResponseEntity<>(userService.login(request.getEmail(), request.getPassword()), HttpStatus.OK);
//    }
//
//    @Operation(
//            summary = "Signup a new user (dev only)",
//            description = "Development endpoint - accepts user info as JSON. Returns the created user."
//    )
//    @ApiResponses(value = {
//            @ApiResponse(responseCode = "201", description = "Signup successful",
//                    content = @Content(schema = @Schema(implementation = UserDto.class))),
//            @ApiResponse(responseCode = "400", description = "Email already registered",
//                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
//    })
//    @PostMapping("/dev/signup")
//    public ResponseEntity<UserDto> devSignup(@RequestBody UserDto userDto) {
//        return new ResponseEntity<>(
//                userService.signup(
//                        userDto.getFirstName(),
//                        userDto.getLastName(),
//                        userDto.getEmail(),
//                        userDto.getPassword()
//                ),
//                HttpStatus.CREATED
//        );
//    }
}
