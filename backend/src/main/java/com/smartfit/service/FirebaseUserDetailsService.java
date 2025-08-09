package com.smartfit.service;

import com.google.firebase.auth.FirebaseAuth;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class FirebaseUserDetailsService implements UserDetailsService {

    @SuppressWarnings("unused")
    private final FirebaseAuth firebaseAuth;

    public FirebaseUserDetailsService(FirebaseAuth firebaseAuth) {
        this.firebaseAuth = firebaseAuth;
    }

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        try {
            // For Firebase, the userId is the UID from the Firebase token
            // We don't need to verify the token again here since it was already verified in the filter
            // We just need to create a UserDetails object for Spring Security
            
            return User.builder()
                    .username(userId)
                    .password("") // Firebase handles authentication, so we don't need a password
                    .authorities(Collections.singletonList(new SimpleGrantedAuthority("USER")))
                    .accountExpired(false)
                    .accountLocked(false)
                    .credentialsExpired(false)
                    .disabled(false)
                    .build();
                    
        } catch (Exception e) {
            throw new UsernameNotFoundException("User not found with userId: " + userId, e);
        }
    }
} 