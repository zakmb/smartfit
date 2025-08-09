package com.smartfit.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.smartfit.config.CheckinEntryDeserializer;
import com.smartfit.validation.ValidCheckinEntry;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@JsonDeserialize(using = CheckinEntryDeserializer.class)
@ValidCheckinEntry
public class CheckinEntry {
    
    private String id;
    
    @NotNull
    private String userId;
    
    @NotNull(message = "Type is required")
    private CheckinType type;
    
    private String title;
    
    private String description;
    
    @Positive(message = "Calories must be a positive number")
    private Integer calories;
    
    @Positive(message = "Duration must be a positive number")
    private Integer duration;
    
    @DecimalMin(value = "0.1", message = "Weight must be greater than 0")
    private Double weight;
    
    @Positive(message = "Water amount must be a positive number")
    private Integer water;
    
    private LocalDateTime timestamp;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    public enum CheckinType {
        WORKOUT, EXERCISE, MEAL, WEIGHT, WATER
    }
    
    public CheckinEntry() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
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
    
    public CheckinType getType() {
        return type;
    }
    
    public void setType(CheckinType type) {
        this.type = type;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Integer getCalories() {
        return calories;
    }
    
    public void setCalories(Integer calories) {
        this.calories = calories;
    }
    
    public Integer getDuration() {
        return duration;
    }
    
    public void setDuration(Integer duration) {
        this.duration = duration;
    }
    
    public Double getWeight() {
        return weight;
    }
    
    public void setWeight(Double weight) {
        this.weight = weight;
    }
    
    public Integer getWater() {
        return water;
    }
    
    public void setWater(Integer water) {
        this.water = water;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
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
    
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
} 