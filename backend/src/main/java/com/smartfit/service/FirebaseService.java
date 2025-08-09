package com.smartfit.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.cloud.FirestoreClient;
import com.google.cloud.firestore.Firestore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.concurrent.ExecutionException;

@Service
public class FirebaseService {

    @Value("${firebase.project-id}")
    private String projectId;

    @Value("${firebase.credentials-file}")
    private String credentialsFile;

    private FirebaseAuth firebaseAuth;
    
    @SuppressWarnings("unused")
    private Firestore firestore;

    @PostConstruct
    public void initialize() throws IOException {
        try {
            GoogleCredentials credentials = GoogleCredentials.fromStream(
                new ClassPathResource(credentialsFile).getInputStream()
            );

            FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(credentials)
                .setProjectId(projectId)
                .build();

            // Check if Firebase is already initialized
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            } else {
                // If already initialized, get the default app
                FirebaseApp app = FirebaseApp.getInstance();
                if (app == null) {
                    FirebaseApp.initializeApp(options);
                }
            }

            this.firebaseAuth = FirebaseAuth.getInstance();
            this.firestore = FirestoreClient.getFirestore();
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize Firebase", e);
        }
    }

    public FirebaseToken verifyIdToken(String idToken) throws ExecutionException, InterruptedException {
        return firebaseAuth.verifyIdTokenAsync(idToken).get();
    }

    public String getUserIdFromToken(String idToken) throws ExecutionException, InterruptedException {
        FirebaseToken decodedToken = verifyIdToken(idToken);
        return decodedToken.getUid();
    }

    public boolean isValidToken(String idToken) {
        try {
            verifyIdToken(idToken);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
} 