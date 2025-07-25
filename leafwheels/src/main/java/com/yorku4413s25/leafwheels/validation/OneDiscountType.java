package com.yorku4413s25.leafwheels.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = OneDiscountTypeValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface OneDiscountType {
    String message() default "Only one discount type (percentage or amount) can be applied";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}