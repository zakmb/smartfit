package com.smartfit.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public class UserSettings {
    private String id;
    private String userId;
    
    @JsonProperty("workoutEnabled")
    private boolean workoutEnabled;
    
    @JsonProperty("mealEnabled")
    private boolean mealEnabled;
    
    @JsonProperty("weightEnabled")
    private boolean weightEnabled;
    
    @JsonProperty("waterEnabled")
    private boolean waterEnabled;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public UserSettings() {
        // Default all settings to true
        this.workoutEnabled = true;
        this.mealEnabled = true;
        this.weightEnabled = true;
        this.waterEnabled = true;
    }

    public UserSettings(String userId) {
        this();
        this.userId = userId;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public boolean isWorkoutEnabled() {
        return workoutEnabled;
    }

    public void setWorkoutEnabled(boolean workoutEnabled) {
        this.workoutEnabled = workoutEnabled;
    }

    public boolean isMealEnabled() {
        return mealEnabled;
    }

    public void setMealEnabled(boolean mealEnabled) {
        this.mealEnabled = mealEnabled;
    }

    public boolean isWeightEnabled() {
        return weightEnabled;
    }

    public void setWeightEnabled(boolean weightEnabled) {
        this.weightEnabled = weightEnabled;
    }

    public boolean isWaterEnabled() {
        return waterEnabled;
    }

    public void setWaterEnabled(boolean waterEnabled) {
        this.waterEnabled = waterEnabled;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "UserSettings{" +
                "id='" + id + '\'' +
                ", userId='" + userId + '\'' +
                ", workoutEnabled=" + workoutEnabled +
                ", mealEnabled=" + mealEnabled +
                ", weightEnabled=" + weightEnabled +
                ", waterEnabled=" + waterEnabled +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}