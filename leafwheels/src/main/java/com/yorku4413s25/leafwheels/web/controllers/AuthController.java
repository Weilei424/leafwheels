package com.yorku4413s25.leafwheels.web.controllers;
import com.yorku4413s25.leafwheels.services.AuthServiceImpl;
import com.yorku4413s25.leafwheels.services.UserService;
import com.yorku4413s25.leafwheels.web.models.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
// TODO: Add api documentation annotations
public class AuthController {

    private final AuthServiceImpl authServiceImpl;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestParam String email, @RequestParam String password) {
        String response = authServiceImpl.register(email, password);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String email, @RequestParam String password) {
        String response = authServiceImpl.login(email, password);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/dev/register")
    public ResponseEntity<UserDto> devRegister(@RequestBody UserDto userDto) {
        return new ResponseEntity<>(userService.signup(
                userDto.getFirstName(),
                userDto.getLastName(),
                userDto.getEmail(),
                userDto.getPassword()), HttpStatus.OK);
    }

    @PostMapping("/dev/login")
    public ResponseEntity<UserDto> devLogin(@RequestBody UserDto userDto) {
        return new ResponseEntity<>(userService.login(
                userDto.getEmail(),
                userDto.getPassword()), HttpStatus.OK);
    }
}

