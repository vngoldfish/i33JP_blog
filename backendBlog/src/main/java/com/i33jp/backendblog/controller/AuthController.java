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
    public ResponseEntity<Map<String, String>> loginUser(@RequestParam String username, @RequestParam String password) {
        Optional<String> tokenOptional = authService.authenticateUser(username, password);

        if (tokenOptional.isPresent()) {
            Map<String, String> response = Collections.singletonMap("token", "Bearer " + tokenOptional.get());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", "Invalid credentials!"));
        }
    }
    // 📌 API Đăng xuất (Logout)
    @PostMapping("/logout")
    public ResponseEntity<String> logoutUser(@RequestHeader("Authorization") String token) {

       String username = jwtUtils.getUsernameFromToken(token);
       User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        authService.logout(token, username);
        return ResponseEntity.ok("User logged out successfully!");
    }

}
