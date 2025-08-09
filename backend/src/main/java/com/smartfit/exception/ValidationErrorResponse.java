package com.smartfit.exception;

import java.time.LocalDateTime;
import java.util.List;

public class ValidationErrorResponse {
    private String message;
    private List<String> errors;
    private LocalDateTime timestamp;
    private int status;

    public ValidationErrorResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public ValidationErrorResponse(String message, List<String> errors, int status) {
        this();
        this.message = message;
        this.errors = errors;
        this.status = status;
    }

    // Getters and setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}