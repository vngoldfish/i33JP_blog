package com.i33jp.backendblog.controller;

import com.i33jp.backendblog.entity.RevokedToken;
import com.i33jp.backendblog.entity.User;
import com.i33jp.backendblog.repository.UserRepository;
import com.i33jp.backendblog.service.AuthService;
import com.i33jp.backendblog.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    @Autowired
    private UserRepository userRepository ;
    @Autowired
    private JwtUtils jwtUtils;
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        String result = authService.registerUser(user);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        Optional<Map<String, Object>> authResponse = authService.authenticateUser(username, password);

        if (authResponse.isPresent()) {
            return ResponseEntity.ok(authResponse.get()); // Trả về token + role
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "Invalid credentials!"));
        }
    }
    // 📌 API Đăng xuất (Logout)
    @PostMapping("/logout")
    public ResponseEntity<String> logoutUser(@RequestHeader("Authorization") String token) {
        System.out.println("Token nhận được khi logout: " + token);
        if (token.startsWith("Bearer ")) {
            token = token.substring(7); // Cắt "Bearer " để lấy token thực sự
        }
        System.out.println("🎯 Token sau khi cắt bỏ 'Bearer ': '" + token + "'");

        String username = jwtUtils.getUsernameFromToken(token);
       User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        authService.logout(token, username);
        return ResponseEntity.ok("User logged out successfully!");
    }

}
