package com.yorku4413s25.leafwheels.exception;

public class EntityNotFoundException extends RuntimeException {
    public EntityNotFoundException(Long id, Class<?> entity) {
        super("The " + entity.getSimpleName().toLowerCase() + " with id '" + id + "' does not exist");
    }
}
