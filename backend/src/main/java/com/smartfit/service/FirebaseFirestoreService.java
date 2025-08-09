package com.smartfit.service;

import com.google.cloud.firestore.*;
import com.smartfit.model.CheckinEntry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class FirebaseFirestoreService {

    private final Firestore firestore;
    private static final String COLLECTION_NAME = "checkins";

    @Autowired
    public FirebaseFirestoreService(Firestore firestore) {
        this.firestore = firestore;
    }

    public List<CheckinEntry> getAllEntriesByUserId(String userId) throws ExecutionException, InterruptedException {
        Query query = firestore.collection(COLLECTION_NAME)
                .whereEqualTo("userId", userId);

        QuerySnapshot querySnapshot = query.get().get();
        List<CheckinEntry> entries = new ArrayList<>();

        for (QueryDocumentSnapshot document : querySnapshot.getDocuments()) {
            entries.add(documentToCheckinEntry(document));
        }

        // Sort in memory instead of in the query to avoid requiring an index
        entries.sort((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));

        return entries;
    }

    public List<CheckinEntry> getEntriesByUserIdAndType(String userId, CheckinEntry.CheckinType type) 
            throws ExecutionException, InterruptedException {
        Query query = firestore.collection(COLLECTION_NAME)
                .whereEqualTo("userId", userId)
                .whereEqualTo("type", type.toString());

        QuerySnapshot querySnapshot = query.get().get();
        List<CheckinEntry> entries = new ArrayList<>();

        for (QueryDocumentSnapshot document : querySnapshot.getDocuments()) {
            entries.add(documentToCheckinEntry(document));
        }

        // Sort in memory instead of in the query to avoid requiring an index
        entries.sort((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));

        return entries;
    }

    public List<CheckinEntry> getEntriesByUserIdAndDateRange(String userId, LocalDateTime startDate, LocalDateTime endDate) 
            throws ExecutionException, InterruptedException {
        Date startDateObj = Date.from(startDate.atZone(ZoneId.systemDefault()).toInstant());
        Date endDateObj = Date.from(endDate.atZone(ZoneId.systemDefault()).toInstant());

        Query query = firestore.collection(COLLECTION_NAME)
                .whereEqualTo("userId", userId)
                .whereGreaterThanOrEqualTo("timestamp", startDateObj)
                .whereLessThanOrEqualTo("timestamp", endDateObj);

        QuerySnapshot querySnapshot = query.get().get();
        List<CheckinEntry> entries = new ArrayList<>();

        for (QueryDocumentSnapshot document : querySnapshot.getDocuments()) {
            entries.add(documentToCheckinEntry(document));
        }

        // Sort in memory instead of in the query to avoid requiring an index
        entries.sort((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));

        return entries;
    }

    public CheckinEntry createEntry(CheckinEntry entry) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection(COLLECTION_NAME).document();
        entry.setId(docRef.getId());
        entry.setCreatedAt(LocalDateTime.now());
        entry.setUpdatedAt(LocalDateTime.now());

        Map<String, Object> data = checkinEntryToMap(entry);
        docRef.set(data).get();

        return entry;
    }

    public Optional<CheckinEntry> getEntryById(String id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(id);
        DocumentSnapshot document = docRef.get().get();

        if (document.exists()) {
            return Optional.of(documentToCheckinEntry(document));
        } else {
            return Optional.empty();
        }
    }

    public CheckinEntry updateEntry(String id, CheckinEntry updatedEntry) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(id);
        DocumentSnapshot document = docRef.get().get();

        if (!document.exists()) {
            throw new RuntimeException("Entry not found with id: " + id);
        }

        updatedEntry.setId(id);
        updatedEntry.setUpdatedAt(LocalDateTime.now());

        Map<String, Object> data = checkinEntryToMap(updatedEntry);
        docRef.update(data).get();

        return updatedEntry;
    }

    public void deleteEntry(String id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(id);
        docRef.delete().get();
    }

    public long getEntryCountByTypeAndDateRange(String userId, CheckinEntry.CheckinType type, 
                                               LocalDateTime startDate, LocalDateTime endDate) 
            throws ExecutionException, InterruptedException {
        Date startDateObj = Date.from(startDate.atZone(ZoneId.systemDefault()).toInstant());
        Date endDateObj = Date.from(endDate.atZone(ZoneId.systemDefault()).toInstant());

        Query query = firestore.collection(COLLECTION_NAME)
                .whereEqualTo("userId", userId)
                .whereEqualTo("type", type.toString())
                .whereGreaterThanOrEqualTo("timestamp", startDateObj)
                .whereLessThanOrEqualTo("timestamp", endDateObj);

        QuerySnapshot querySnapshot = query.get().get();
        return querySnapshot.size();
    }

    private CheckinEntry documentToCheckinEntry(DocumentSnapshot document) {
        CheckinEntry entry = new CheckinEntry();
        entry.setId(document.getId());
        entry.setUserId(document.getString("userId"));
        
        // Handle type conversion with null checking and error handling
        String typeString = document.getString("type");
        if (typeString != null && !typeString.trim().isEmpty()) {
            try {
                // First try with the original string (in case it's already uppercase)
                entry.setType(CheckinEntry.CheckinType.valueOf(typeString));
            } catch (IllegalArgumentException e1) {
                try {
                    // If that fails, try with uppercase conversion
                    entry.setType(CheckinEntry.CheckinType.valueOf(typeString.toUpperCase()));
                } catch (IllegalArgumentException e2) {
                    // Log the error and provide a fallback
                    System.err.println("Invalid checkin type: " + typeString + ". Available types: " + 
                        java.util.Arrays.toString(CheckinEntry.CheckinType.values()));
                    // Set a default type or skip this entry
                    throw new RuntimeException("Invalid checkin type: " + typeString + 
                        ". Expected one of: " + java.util.Arrays.toString(CheckinEntry.CheckinType.values()), e2);
                }
            }
        } else {
            throw new RuntimeException("Checkin type cannot be null or empty");
        }
        
        entry.setTitle(document.getString("title"));
        entry.setDescription(document.getString("description"));
        entry.setCalories(document.getLong("calories") != null ? document.getLong("calories").intValue() : null);
        entry.setDuration(document.getLong("duration") != null ? document.getLong("duration").intValue() : null);
        entry.setWeight(document.getDouble("weight"));
        entry.setWater(document.getLong("water") != null ? document.getLong("water").intValue() : null);
        
        if (document.getTimestamp("timestamp") != null) {
            entry.setTimestamp(document.getTimestamp("timestamp").toDate().toInstant()
                    .atZone(ZoneId.systemDefault()).toLocalDateTime());
        }
        
        if (document.getTimestamp("createdAt") != null) {
            entry.setCreatedAt(document.getTimestamp("createdAt").toDate().toInstant()
                    .atZone(ZoneId.systemDefault()).toLocalDateTime());
        }
        
        if (document.getTimestamp("updatedAt") != null) {
            entry.setUpdatedAt(document.getTimestamp("updatedAt").toDate().toInstant()
                    .atZone(ZoneId.systemDefault()).toLocalDateTime());
        }

        return entry;
    }

    private Map<String, Object> checkinEntryToMap(CheckinEntry entry) {
        Map<String, Object> data = new HashMap<>();
        data.put("userId", entry.getUserId());
        data.put("type", entry.getType().toString());
        data.put("title", entry.getTitle());
        data.put("description", entry.getDescription());
        data.put("calories", entry.getCalories());
        data.put("duration", entry.getDuration());
        data.put("weight", entry.getWeight());
        data.put("water", entry.getWater());
        data.put("timestamp", Date.from(entry.getTimestamp().atZone(ZoneId.systemDefault()).toInstant()));
        data.put("createdAt", Date.from(entry.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant()));
        data.put("updatedAt", Date.from(entry.getUpdatedAt().atZone(ZoneId.systemDefault()).toInstant()));
        return data;
    }
} 