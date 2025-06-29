package com.yorku4413s25.leafwheels.web.models;

import com.yorku4413s25.leafwheels.constants.Role;
import lombok.*;

import java.util.UUID;

/**
 * DTO for {@link com.yorku4413s25.leafwheels.domain.User}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    UUID id;
    Role role;
    String firstName;
    String lastName;
    String email;
    String password;
}
