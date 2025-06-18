package com.yorku4413s25.leafwheels.exception;

import java.util.UUID;

public class EntityNotFoundException extends RuntimeException {
    public EntityNotFoundException(UUID id, Class<?> entity) {
        super("The " + entity.getSimpleName().toLowerCase() + " with id '" + id.toString() + "' does not exist");
    }
}
