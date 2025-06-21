package com.yorku4413s25.leafwheels.exception;

import java.util.UUID;

public class EntitiesNotMatchException extends RuntimeException {

    public EntitiesNotMatchException(UUID id1, Class<?> entity1, UUID id2, Class<?> entity2) {
        super("The " + entity1.getSimpleName().toLowerCase() + " with id '" + id1 + "' does not exist in "
                + entity2.getSimpleName().toLowerCase() + " with id '" + id2);
    }
}
