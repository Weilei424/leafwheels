package com.yorku4413s25.leafwheels.validation;

import com.yorku4413s25.leafwheels.domain.Vehicle;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.math.BigDecimal;

public class OneDiscountTypeValidator implements ConstraintValidator<OneDiscountType, Vehicle> {

    @Override
    public void initialize(OneDiscountType constraintAnnotation) {
    }

    @Override
    public boolean isValid(Vehicle vehicle, ConstraintValidatorContext context) {
        if (vehicle == null) {
            return true;
        }

        BigDecimal discountPercentage = vehicle.getDiscountPercentage();
        BigDecimal discountAmount = vehicle.getDiscountAmount();

        boolean hasPercentage = discountPercentage != null && discountPercentage.compareTo(BigDecimal.ZERO) > 0;
        boolean hasAmount = discountAmount != null && discountAmount.compareTo(BigDecimal.ZERO) > 0;

        return !(hasPercentage && hasAmount);
    }
}