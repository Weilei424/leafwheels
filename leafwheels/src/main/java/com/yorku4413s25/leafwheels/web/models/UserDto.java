package com.yorku4413s25.leafwheels.web.models;

import com.yorku4413s25.leafwheels.constants.Role;
import lombok.Value;

import java.io.Serializable;
import java.util.UUID;

/**
 * DTO for {@link com.yorku4413s25.leafwheels.domain.User}
 */
@Value
public class UserDto implements Serializable {
    UUID id;
    Role role;
    String firstName;
    String lastName;
    String email;
    String password;
}
