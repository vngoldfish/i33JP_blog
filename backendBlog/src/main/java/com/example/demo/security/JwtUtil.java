package com.example.demo.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {

    // 🔥 Dùng 2 SECRET KEY riêng biệt cho JWT và Refresh Token
    //private static final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    //private static final SecretKey REFRESH_SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor("your-very-secret-key-which-is-at-least-32-bytes".getBytes());
    private static final SecretKey REFRESH_SECRET_KEY = Keys.hmacShaKeyFor("your-refresh-secret-key-which-is-also-32-bytes".getBytes());


    // ⏳ Thời gian hết hạn của JWT (15 phút)
    //private static final long JWT_EXPIRATION = 30 * 60 * 1000;
    //private static final long JWT_EXPIRATION = 1 * 24 * 60 * 60 * 1000;
    private static final long JWT_EXPIRATION = 3 * 60 * 1000; // 3 phút


    // ⏳ Thời gian hết hạn của Refresh Token (7 ngày)
    private static final long REFRESH_EXPIRATION = 7 * 24 * 60 * 60 * 1000;

    // ✅ Chọn Secret Key dựa trên loại token
    public SecretKey getSecretKey(boolean isRefreshToken) {
        return isRefreshToken ? REFRESH_SECRET_KEY : SECRET_KEY;
    }

    // ✅ Tạo JWT Token
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setClaims(Map.of("role", role))
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
                .signWith(SECRET_KEY)
                .compact();
    }

    // ✅ Tạo Cookie chứa JWT Token
    public ResponseCookie createTokenCookie(String token) {
        return ResponseCookie.from("JWT_TOKEN", token)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(JWT_EXPIRATION / 1000)
                .build();
    }

    // ✅ Tạo Refresh Token
    public String generateRefreshToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_EXPIRATION))
                .signWith(REFRESH_SECRET_KEY)
                .compact();
    }

    // ✅ Tạo Cookie chứa Refresh Token
    public ResponseCookie createRefreshTokenCookie(String refreshToken) {
        return ResponseCookie.from("REFRESH_TOKEN", refreshToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(REFRESH_EXPIRATION / 1000)
                .build();
    }

    // 🔹 Lấy Token từ Cookie
    public String getTokenFromCookie(HttpServletRequest request, String cookieName) {
        if (request.getCookies() == null) return null;
        for (var cookie : request.getCookies()) {
            if (cookie.getName().equals(cookieName)) {
                return cookie.getValue();
            }
        }
        return null;
    }

    // ✅ Giải mã JWT với Secret Key phù hợp
    public Claims extractClaims(String token, boolean isRefreshToken) {
        return Jwts.parserBuilder()
                .setSigningKey(getSecretKey(isRefreshToken))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ✅ Lấy Username từ Token
    public String extractUsername(String token, boolean isRefreshToken) {
        return extractClaims(token, isRefreshToken).getSubject();
    }

    // ✅ Lấy Role từ JWT Token
    public String extractRole(String token) {
        return extractClaims(token, false).get("role", String.class);
    }

    // ✅ Kiểm tra Token có hợp lệ không
    public boolean isTokenValid(String token, boolean isRefreshToken) {
        try {
            return !isTokenExpired(token, isRefreshToken);
        } catch (JwtException e) {
            return false; // ❌ Token không hợp lệ
        }
    }

    // ✅ Kiểm tra Token có hết hạn không
    public boolean isTokenExpired(String token, boolean isRefreshToken) {
        return extractClaims(token, isRefreshToken).getExpiration().before(new Date());
    }

    // ✅ Xóa Cookie JWT và Refresh Token khi logout
    public void removeJwtCookie(HttpServletResponse response) {
        //response.addCookie(createExpiredCookie("JWT_TOKEN"));
        response.addCookie(createExpiredCookie("REFRESH_TOKEN"));
        //response.addCookie(createExpiredCookie("XSRF-TOKEN")); // Nếu dùng CSRF
    }

    // ✅ Tạo cookie hết hạn để xóa khỏi trình duyệt
    private Cookie createExpiredCookie(String name) {
        Cookie cookie = new Cookie(name, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // ❌ Xóa ngay lập tức
        return cookie;
    }
}
