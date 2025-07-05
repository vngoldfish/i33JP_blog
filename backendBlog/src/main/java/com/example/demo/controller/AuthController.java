package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.entity.UserProfile;
import com.example.demo.repository.RevokedTokenRepository;
import com.example.demo.security.ActionType;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.AuditLogService;
import com.example.demo.service.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Slf4j
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // ✅ Bật CORS cho phép cookie
public class AuthController {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final AuditLogService auditLogService;


    public AuthController(UserService userService, JwtUtil jwtUtil, AuditLogService auditLogService) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.auditLogService = auditLogService;
    }


    // API đăng nhập
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequestDto request, HttpServletResponse response,
                                   HttpServletRequest httpRequest) {
        try {
            LoginResponseDto dto = userService.handleLogin(request, response, httpRequest);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Đã xảy ra lỗi khi đăng nhập"));
        }
    }
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication, HttpServletRequest request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Chưa xác thực"));
        }

        String username = authentication.getName(); // lấy username từ token
        String role = authentication.getAuthorities().iterator().next().getAuthority();

        User user = userService.findByUsername(username);
        UserProfile profile = user.getProfile();

        String fullName = profile != null ? profile.getFullName() : null;
        String avatarUrl = profile != null ? profile.getAvatarUrl() : null;

        // Không cần accessToken vì đây là "me"
        return ResponseEntity.ok(
                new LoginResponseDto(
                        "Thông tin người dùng hiện tại",
                        username,
                        role,
                        null, // không trả lại accessToken
                        fullName,
                        avatarUrl
                )
        );
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequestDto dto) {
        // Gọi UserService để xử lý đăng ký
        userService.registerUser(dto);
        return ResponseEntity.ok(Map.of("message", "Đăng ký thành công"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            userService.logout(request, response);
            return ResponseEntity.ok(Map.of("message", "Logout thành công"));
        } catch (ExpiredJwtException e) {
            jwtUtil.removeJwtCookie(response);
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED)
                    .body(Map.of("message", "Token đã hết hạn. Vui lòng đăng nhập lại."));
        } catch (JwtException e) {
            jwtUtil.removeJwtCookie(response);
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED)
                    .body(Map.of("message", "Token không hợp lệ. Đã đăng xuất."));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Đã xảy ra lỗi khi logout"));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {

        try {
            Map<String, Object> result = userService.refreshToken(request, response);
            return ResponseEntity.ok(result);
        } catch (ExpiredJwtException e) {
            jwtUtil.removeJwtCookie(response);
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED)
                    .body(Map.of("message", "Refresh Token đã hết hạn. Vui lòng đăng nhập lại."));
        } catch (JwtException e) {
            jwtUtil.removeJwtCookie(response);
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED)
                    .body(Map.of("message", "Refresh Token không hợp lệ. Vui lòng đăng nhập lại."));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Đã xảy ra lỗi khi refresh token"));
        }
    }


}
