package com.smartfit.controller;

import com.smartfit.model.CheckinEntry;
import com.smartfit.service.CheckinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/checkin")
@CrossOrigin(origins = "*")
public class CheckinController {

    private final CheckinService checkinService;

    @Autowired
    public CheckinController(CheckinService checkinService) {
        this.checkinService = checkinService;
    }

    @GetMapping
    public ResponseEntity<List<CheckinEntry>> getAllEntries(Authentication authentication) {
        String userId = authentication.getName();
        List<CheckinEntry> entries = checkinService.getAllEntriesByUserId(userId);
        return ResponseEntity.ok(entries);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CheckinEntry> getEntryById(@PathVariable String id, Authentication authentication) {
        String userId = authentication.getName();
        return checkinService.getEntryById(id)
                .filter(entry -> entry.getUserId().equals(userId))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<CheckinEntry>> getEntriesByType(
            @PathVariable CheckinEntry.CheckinType type, 
            Authentication authentication) {
        String userId = authentication.getName();
        List<CheckinEntry> entries = checkinService.getEntriesByUserIdAndType(userId, type);
        return ResponseEntity.ok(entries);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<CheckinEntry>> getEntriesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Authentication authentication) {
        String userId = authentication.getName();
        List<CheckinEntry> entries = checkinService.getEntriesByUserIdAndDateRange(userId, startDate, endDate);
        return ResponseEntity.ok(entries);
    }

    @PostMapping
    public ResponseEntity<CheckinEntry> createEntry(@Valid @RequestBody CheckinEntry entry, 
                                                   Authentication authentication) {
        // userId is automatically set by the custom deserializer
        CheckinEntry createdEntry = checkinService.createEntry(entry);
        return ResponseEntity.ok(createdEntry);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CheckinEntry> updateEntry(@PathVariable String id, 
                                                   @Valid @RequestBody CheckinEntry entry,
                                                   Authentication authentication) {
        String userId = authentication.getName();
        return checkinService.getEntryById(id)
                .filter(existingEntry -> existingEntry.getUserId().equals(userId))
                .map(existingEntry -> {
                    CheckinEntry updatedEntry = checkinService.updateEntry(id, entry);
                    return ResponseEntity.ok(updatedEntry);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable String id, Authentication authentication) {
        String userId = authentication.getName();
        return checkinService.getEntryById(id)
                .filter(entry -> entry.getUserId().equals(userId))
                .map(entry -> {
                    checkinService.deleteEntry(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats")
    public ResponseEntity<Object> getStats(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Authentication authentication) {
        String userId = authentication.getName();
        
        long workoutCount = checkinService.getEntryCountByTypeAndDateRange(userId, CheckinEntry.CheckinType.WORKOUT, startDate, endDate);
        long exerciseCount = checkinService.getEntryCountByTypeAndDateRange(userId, CheckinEntry.CheckinType.EXERCISE, startDate, endDate);
        long mealCount = checkinService.getEntryCountByTypeAndDateRange(userId, CheckinEntry.CheckinType.MEAL, startDate, endDate);
        long weightCount = checkinService.getEntryCountByTypeAndDateRange(userId, CheckinEntry.CheckinType.WEIGHT, startDate, endDate);
        long waterCount = checkinService.getEntryCountByTypeAndDateRange(userId, CheckinEntry.CheckinType.WATER, startDate, endDate);
        
        return ResponseEntity.ok(new Object() {
            @SuppressWarnings("unused")
            public final long workouts = workoutCount;
            @SuppressWarnings("unused")
            public final long exercises = exerciseCount;
            @SuppressWarnings("unused")
            public final long meals = mealCount;
            @SuppressWarnings("unused")
            public final long weights = weightCount;
            @SuppressWarnings("unused")
            public final long water = waterCount;
        });
    }
} 