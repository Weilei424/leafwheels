package com.yorku4413s25.leafwheels.exception;

public class EmailNotFoundException extends RuntimeException {
    public EmailNotFoundException(String email, Class<?> entity) {
        super("The " + entity.getSimpleName().toLowerCase() + " with email '" + email + "' does not exist");
    }
}
