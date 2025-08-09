package com.smartfit.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.stereotype.Service;

@Service
public class FirebaseAuthService {

    private final FirebaseAuth firebaseAuth;

    public FirebaseAuthService(FirebaseAuth firebaseAuth) {
        this.firebaseAuth = firebaseAuth;
    }

    public String getUserIdFromToken(String idToken) throws Exception {
        FirebaseToken decodedToken = firebaseAuth.verifyIdToken(idToken);
        return decodedToken.getUid();
    }

    public boolean isValidToken(String idToken) {
        try {
            firebaseAuth.verifyIdToken(idToken);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
} 