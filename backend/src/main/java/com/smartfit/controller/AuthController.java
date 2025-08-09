package com.smartfit.controller;

import com.smartfit.service.FirebaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final FirebaseService firebaseService;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthController(FirebaseService firebaseService, AuthenticationManager authenticationManager) {
        this.firebaseService = firebaseService;
        this.authenticationManager = authenticationManager;
    }

    @SuppressWarnings("unused")
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyToken(@RequestBody Map<String, String> request) {
        String idToken = request.get("idToken");
        
        try {
            String userId = firebaseService.getUserIdFromToken(idToken);
            
            // Authenticate with Spring Security
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userId, idToken)
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("valid", true);
            response.put("userId", userId);
            response.put("message", "Token verified successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            response.put("message", "Invalid token");
            
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Authentication service is running");
        return ResponseEntity.ok(response);
    }
} 