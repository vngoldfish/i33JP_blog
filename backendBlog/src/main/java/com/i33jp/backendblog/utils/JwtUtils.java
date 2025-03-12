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
import java.util.List;

@Component

public class JwtUtils {
    private final String SECRET_KEY = System.getenv("JWT_SECRET_KEY") != null
            ? System.getenv("JWT_SECRET_KEY")
            : "default-secret-key-123"; //     @Autowired
    private RevokedTokenRepository revokedTokenRepository;
    // Tạo token JWT
    public String generateToken(String username, List<String> roles) {
        if (username == null || username.isEmpty()) {
            throw new IllegalArgumentException("Username không hợp lệ");
        }
        if (roles == null || roles.isEmpty()) {
            roles = List.of("ROLE_USER"); // ✅ Đặt giá trị mặc định
        }

        return JWT.create()
                .withSubject(username) // ✅ Kiểm tra xem có bị null hoặc lỗi không
                .withClaim("roles", roles) // ✅ Kiểm tra roles có đúng List<String> không
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // Hạn 10h
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
    // Lấy thông tin ROLE từ token
    public List<String> getRolesFromToken(String token) {
        DecodedJWT decodedJWT = JWT.require(Algorithm.HMAC512(SECRET_KEY))
                .build()
                .verify(token); // Xác thực token

        return decodedJWT.getClaim("roles").asList(String.class); // Trả về danh sách role
    }
    // Kiểm tra token có hợp lệ không

    public boolean isTokenValid(String token) {
        if (revokedTokenRepository.existsByToken(token)) {
            return false; // Token đã bị thu hồi
        }
        try {
            JWTVerifier verifier = JWT.require(Algorithm.HMAC512(SECRET_KEY)).build();
            verifier.verify(token);
            return true;
        } catch (JWTVerificationException e) {
            return false; // Token không hợp lệ hoặc đã hết hạn
        }
    }
}
