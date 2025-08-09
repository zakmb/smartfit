package com.smartfit.service;

import com.google.cloud.firestore.*;
import com.smartfit.model.UserSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class SettingsService {

    private final Firestore firestore;
    private static final String COLLECTION_NAME = "settings";

    @Autowired
    public SettingsService(Firestore firestore) {
        this.firestore = firestore;
    }

    public UserSettings getUserSettings(String userId) throws ExecutionException, InterruptedException {
        // Query for settings by userId
        Query query = firestore.collection(COLLECTION_NAME)
                .whereEqualTo("userId", userId)
                .limit(1);

        QuerySnapshot querySnapshot = query.get().get();

        if (!querySnapshot.isEmpty()) {
            // Return existing settings
            DocumentSnapshot document = querySnapshot.getDocuments().get(0);
            return documentToUserSettings(document);
        } else {
            // Return default settings if none exist
            return new UserSettings(userId);
        }
    }

    public UserSettings saveUserSettings(UserSettings settings) throws ExecutionException, InterruptedException {
        // Check if settings already exist for this user
        Query query = firestore.collection(COLLECTION_NAME)
                .whereEqualTo("userId", settings.getUserId())
                .limit(1);

        QuerySnapshot querySnapshot = query.get().get();

        if (!querySnapshot.isEmpty()) {
            // Update existing settings
            DocumentSnapshot existingDoc = querySnapshot.getDocuments().get(0);
            String docId = existingDoc.getId();
            
            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(docId);
            settings.setId(docId);
            settings.setUpdatedAt(LocalDateTime.now());
            // Preserve createdAt from existing document
            if (existingDoc.contains("createdAt")) {
                settings.setCreatedAt(documentToUserSettings(existingDoc).getCreatedAt());
            } else {
                settings.setCreatedAt(LocalDateTime.now());
            }

            Map<String, Object> data = userSettingsToMap(settings);
            docRef.set(data).get(); // Use set() to replace the entire document
        } else {
            // Create new settings
            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document();
            settings.setId(docRef.getId());
            settings.setCreatedAt(LocalDateTime.now());
            settings.setUpdatedAt(LocalDateTime.now());

            Map<String, Object> data = userSettingsToMap(settings);
            docRef.set(data).get();
        }

        return settings;
    }

    private UserSettings documentToUserSettings(DocumentSnapshot document) {
        UserSettings settings = new UserSettings();
        settings.setId(document.getId());
        settings.setUserId(document.getString("userId"));
        
        // Handle boolean fields with default values
        settings.setWorkoutEnabled(document.contains("workoutEnabled") ? 
            document.getBoolean("workoutEnabled") : true);
        settings.setMealEnabled(document.contains("mealEnabled") ? 
            document.getBoolean("mealEnabled") : true);
        settings.setWeightEnabled(document.contains("weightEnabled") ? 
            document.getBoolean("weightEnabled") : true);
        settings.setWaterEnabled(document.contains("waterEnabled") ? 
            document.getBoolean("waterEnabled") : true);

        // Handle timestamps
        if (document.contains("createdAt")) {
            Date createdAt = document.getDate("createdAt");
            if (createdAt != null) {
                settings.setCreatedAt(LocalDateTime.ofInstant(createdAt.toInstant(), ZoneId.systemDefault()));
            }
        }

        if (document.contains("updatedAt")) {
            Date updatedAt = document.getDate("updatedAt");
            if (updatedAt != null) {
                settings.setUpdatedAt(LocalDateTime.ofInstant(updatedAt.toInstant(), ZoneId.systemDefault()));
            }
        }

        return settings;
    }

    private Map<String, Object> userSettingsToMap(UserSettings settings) {
        Map<String, Object> map = new HashMap<>();
        map.put("userId", settings.getUserId());
        map.put("workoutEnabled", settings.isWorkoutEnabled());
        map.put("mealEnabled", settings.isMealEnabled());
        map.put("weightEnabled", settings.isWeightEnabled());
        map.put("waterEnabled", settings.isWaterEnabled());

        if (settings.getCreatedAt() != null) {
            map.put("createdAt", Date.from(settings.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant()));
        }
        if (settings.getUpdatedAt() != null) {
            map.put("updatedAt", Date.from(settings.getUpdatedAt().atZone(ZoneId.systemDefault()).toInstant()));
        }

        return map;
    }
}