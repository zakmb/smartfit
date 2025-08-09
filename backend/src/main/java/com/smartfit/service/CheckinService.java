package com.smartfit.service;

import com.smartfit.model.CheckinEntry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Service
public class CheckinService {

    private final FirebaseFirestoreService firebaseFirestoreService;

    @Autowired
    public CheckinService(FirebaseFirestoreService firebaseFirestoreService) {
        this.firebaseFirestoreService = firebaseFirestoreService;
    }

    public List<CheckinEntry> getAllEntriesByUserId(String userId) {
        try {
            return firebaseFirestoreService.getAllEntriesByUserId(userId);
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException("Failed to get entries", e);
        }
    }

    public List<CheckinEntry> getEntriesByUserIdAndType(String userId, CheckinEntry.CheckinType type) {
        try {
            return firebaseFirestoreService.getEntriesByUserIdAndType(userId, type);
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException("Failed to get entries by type", e);
        }
    }

    public List<CheckinEntry> getEntriesByUserIdAndDateRange(String userId, LocalDateTime startDate, LocalDateTime endDate) {
        try {
            return firebaseFirestoreService.getEntriesByUserIdAndDateRange(userId, startDate, endDate);
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException("Failed to get entries by date range", e);
        }
    }

    public CheckinEntry createEntry(CheckinEntry entry) {
        try {
            return firebaseFirestoreService.createEntry(entry);
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException("Failed to create entry", e);
        }
    }

    public Optional<CheckinEntry> getEntryById(String id) {
        try {
            return firebaseFirestoreService.getEntryById(id);
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException("Failed to get entry by id", e);
        }
    }

    public CheckinEntry updateEntry(String id, CheckinEntry updatedEntry) {
        try {
            return firebaseFirestoreService.updateEntry(id, updatedEntry);
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException("Failed to update entry", e);
        }
    }

    public void deleteEntry(String id) {
        try {
            firebaseFirestoreService.deleteEntry(id);
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException("Failed to delete entry", e);
        }
    }

    public long getEntryCountByTypeAndDateRange(String userId, CheckinEntry.CheckinType type, 
                                               LocalDateTime startDate, LocalDateTime endDate) {
        try {
            return firebaseFirestoreService.getEntryCountByTypeAndDateRange(userId, type, startDate, endDate);
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException("Failed to get entry count", e);
        }
    }
} 