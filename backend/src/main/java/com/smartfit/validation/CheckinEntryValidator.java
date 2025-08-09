package com.smartfit.validation;

import com.smartfit.model.CheckinEntry;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CheckinEntryValidator implements ConstraintValidator<ValidCheckinEntry, CheckinEntry> {

    @Override
    public void initialize(ValidCheckinEntry constraintAnnotation) {
        // No initialization needed
    }

    @Override
    public boolean isValid(CheckinEntry entry, ConstraintValidatorContext context) {
        if (entry == null || entry.getType() == null) {
            return true; // Let @NotNull handle null checks
        }

        boolean isValid = true;
        context.disableDefaultConstraintViolation();

        switch (entry.getType()) {
            case WORKOUT:
                if (entry.getDuration() == null || entry.getDuration() <= 0) {
                    context.buildConstraintViolationWithTemplate("Duration is required for workouts and must be positive")
                           .addConstraintViolation();
                    isValid = false;
                }
                // Note: Exercise details are handled in description, not validated here
                break;

            case EXERCISE:
                if (entry.getDuration() == null || entry.getDuration() <= 0) {
                    context.buildConstraintViolationWithTemplate("Duration is required for exercises and must be positive")
                           .addConstraintViolation();
                    isValid = false;
                }
                if (entry.getCalories() == null || entry.getCalories() <= 0) {
                    context.buildConstraintViolationWithTemplate("Calories are required for exercises and must be positive")
                           .addConstraintViolation();
                    isValid = false;
                }
                break;

            case MEAL:
                if (entry.getTitle() == null || entry.getTitle().trim().isEmpty()) {
                    context.buildConstraintViolationWithTemplate("Meal name is required")
                           .addConstraintViolation();
                    isValid = false;
                }
                if (entry.getCalories() == null || entry.getCalories() <= 0) {
                    context.buildConstraintViolationWithTemplate("Calories are required for meals and must be positive")
                           .addConstraintViolation();
                    isValid = false;
                }
                break;

            case WEIGHT:
                if (entry.getWeight() == null || entry.getWeight() <= 0) {
                    context.buildConstraintViolationWithTemplate("Weight is required and must be positive")
                           .addConstraintViolation();
                    isValid = false;
                }
                break;

            case WATER:
                if (entry.getWater() == null || entry.getWater() <= 0) {
                    context.buildConstraintViolationWithTemplate("Water amount is required and must be positive")
                           .addConstraintViolation();
                    isValid = false;
                }
                break;
        }

        return isValid;
    }
}