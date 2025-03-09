package com.i33jp.backendblog.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.i33jp.backendblog.repository.RevokedTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component

public class JwtUtils {
    private final String SECRET_KEY = "your-secret-key"; // Thay đổi thành một secret key mạnh
    @Autowired
    private RevokedTokenRepository revokedTokenRepository;
    // Tạo token JWT
    public String generateToken(String username) { // Thay Authentication bằng String username
        return JWT.create()
                .withSubject(username)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 giờ
                .sign(Algorithm.HMAC512(SECRET_KEY));
    }

    // Xác thực token
    public boolean validateToken(String token) {
        try {
            DecodedJWT decodedJWT = JWT.require(Algorithm.HMAC512(SECRET_KEY))
                    .build()
                    .verify(token);  // Xác thực token
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Lấy thông tin từ token
    public String getUsernameFromToken(String token) {
        DecodedJWT decodedJWT = JWT.require(Algorithm.HMAC512(SECRET_KEY))
                .build()
                .verify(token); // Xác thực token
        return decodedJWT.getSubject();  // Trả về thông tin username từ token
    }

    public boolean isTokenValid(String token) {
        if (revokedTokenRepository.existsByToken(token)) {
            return false; // Token đã bị thu hồi
        }
        try {
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(SECRET_KEY)).build();
            verifier.verify(token);
            return true;
        } catch (JWTVerificationException e) {
            return false; // Token không hợp lệ hoặc đã hết hạn
        }
    }
}
