package com.smartfit.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = CheckinEntryValidator.class)
@Documented
public @interface ValidCheckinEntry {
    String message() default "Invalid checkin entry";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}