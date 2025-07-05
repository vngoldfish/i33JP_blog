package com.example.demo.service;

import com.example.demo.repository.RevokedTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RevokedTokenService {

    private final RevokedTokenRepository revokedTokenRepository;

    public boolean isRevoked(String token) {
        return revokedTokenRepository.existsByToken(token);
    }

}