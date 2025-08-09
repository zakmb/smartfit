package com.smartfit.controller;

import com.smartfit.model.UserSettings;
import com.smartfit.service.FirebaseService;
import com.smartfit.service.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class SettingsController {

    private final SettingsService settingsService;
    private final FirebaseService firebaseService;

    @Autowired
    public SettingsController(SettingsService settingsService, FirebaseService firebaseService) {
        this.settingsService = settingsService;
        this.firebaseService = firebaseService;
    }

    @GetMapping
    public ResponseEntity<UserSettings> getUserSettings(@RequestHeader("Authorization") String authHeader) {
        try {
            String idToken = authHeader.replace("Bearer ", "");
            String userId = firebaseService.getUserIdFromToken(idToken);

            UserSettings settings = settingsService.getUserSettings(userId);
            return ResponseEntity.ok(settings);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<UserSettings> saveUserSettings(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UserSettings settings) {
        try {
            String idToken = authHeader.replace("Bearer ", "");
            String userId = firebaseService.getUserIdFromToken(idToken);

            // Ensure the settings belong to the authenticated user
            settings.setUserId(userId);

            UserSettings savedSettings = settingsService.saveUserSettings(settings);
            return ResponseEntity.ok(savedSettings);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping
    public ResponseEntity<UserSettings> updateUserSettings(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UserSettings settings) {
        try {
            String idToken = authHeader.replace("Bearer ", "");
            String userId = firebaseService.getUserIdFromToken(idToken);

            // Ensure the settings belong to the authenticated user
            settings.setUserId(userId);

            UserSettings savedSettings = settingsService.saveUserSettings(settings);
            return ResponseEntity.ok(savedSettings);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}