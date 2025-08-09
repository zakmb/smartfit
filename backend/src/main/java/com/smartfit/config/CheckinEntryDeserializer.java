package com.smartfit.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.smartfit.model.CheckinEntry;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class CheckinEntryDeserializer extends JsonDeserializer<CheckinEntry> {
    
    @Override
    public CheckinEntry deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        JsonNode node = p.getCodec().readTree(p);
        
        CheckinEntry entry = new CheckinEntry();
        
        // Set userId from authentication context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getName() != null) {
            entry.setUserId(authentication.getName());
        }
        
        // Deserialize other fields
        if (node.has("type")) {
            entry.setType(CheckinEntry.CheckinType.valueOf(node.get("type").asText()));
        }
        
        if (node.has("title")) {
            entry.setTitle(node.get("title").asText());
        }
        
        if (node.has("description")) {
            entry.setDescription(node.get("description").asText());
        }
        
        if (node.has("calories") && !node.get("calories").isNull()) {
            entry.setCalories(node.get("calories").asInt());
        }
        
        if (node.has("duration") && !node.get("duration").isNull()) {
            entry.setDuration(node.get("duration").asInt());
        }
        
        if (node.has("weight") && !node.get("weight").isNull()) {
            entry.setWeight(node.get("weight").asDouble());
        }
        
        if (node.has("water") && !node.get("water").isNull()) {
            entry.setWater(node.get("water").asInt());
        }
        
        if (node.has("timestamp") && !node.get("timestamp").isNull()) {
            String timestampStr = node.get("timestamp").asText();
            try {
                // Handle different timestamp formats
                LocalDateTime timestamp;
                if (timestampStr.contains("T")) {
                    // ISO format with timezone info
                    timestamp = LocalDateTime.parse(timestampStr, DateTimeFormatter.ISO_DATE_TIME);
                } else {
                    // Try parsing as a simple date string
                    timestamp = LocalDateTime.parse(timestampStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                }
                entry.setTimestamp(timestamp);
            } catch (Exception e) {
                System.err.println("Failed to parse timestamp: " + timestampStr + ", using current time. Error: " + e.getMessage());
                // If parsing fails, use current time
                entry.setTimestamp(LocalDateTime.now());
            }
        } else {
            // Set default timestamp if not provided
            entry.setTimestamp(LocalDateTime.now());
        }
        
        return entry;
    }
} 