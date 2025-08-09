package com.smartfit.security;

import com.smartfit.service.FirebaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class FirebaseAuthenticationProvider implements AuthenticationProvider {

    private final FirebaseService firebaseService;

    @Autowired
    public FirebaseAuthenticationProvider(FirebaseService firebaseService) {
        this.firebaseService = firebaseService;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String token = authentication.getCredentials().toString();
        
        if (firebaseService.isValidToken(token)) {
            try {
                String userId = firebaseService.getUserIdFromToken(token);
                UserDetails userDetails = User.builder()
                    .username(userId)
                    .password("") // Firebase handles password
                    .authorities(new ArrayList<>())
                    .build();
                
                return new UsernamePasswordAuthenticationToken(userDetails, token, userDetails.getAuthorities());
            } catch (Exception e) {
                throw new BadCredentialsException("Invalid Firebase token");
            }
        }
        
        throw new BadCredentialsException("Invalid Firebase token");
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
} 