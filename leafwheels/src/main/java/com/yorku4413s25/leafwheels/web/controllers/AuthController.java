package com.yorku4413s25.leafwheels.web.controllers;

import com.yorku4413s25.leafwheels.services.UserService;
import com.yorku4413s25.leafwheels.web.models.LoginRequestDto;
import com.yorku4413s25.leafwheels.web.models.UserDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication (Dev)", description = "Endpoints for development login and signup (no hashing, no tokens)")
public class AuthController {

    private final UserService userService;

    @Operation(
            summary = "Login a user (dev only)",
            description = "Accepts email and password as JSON. Returns user details if successful."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successful",
                    content = @Content(schema = @Schema(implementation = UserDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid credentials",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/login")
    public ResponseEntity<UserDto> devLogin(@RequestBody LoginRequestDto request) {
        return new ResponseEntity<>(userService.login(request.getEmail(), request.getPassword()), HttpStatus.OK);
    }



    @Operation(
            summary = "Signup a new user (dev only)",
            description = "Accepts user info as JSON. Returns the created user."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Signup successful",
                    content = @Content(schema = @Schema(implementation = UserDto.class))),
            @ApiResponse(responseCode = "400", description = "Email already registered",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/signup")
    public ResponseEntity<UserDto> devSignup(@RequestBody UserDto userDto) {
        return new ResponseEntity<>(
                userService.signup(
                        userDto.getFirstName(),
                        userDto.getLastName(),
                        userDto.getEmail(),
                        userDto.getPassword()
                ),
                HttpStatus.CREATED
        );
    }
}
