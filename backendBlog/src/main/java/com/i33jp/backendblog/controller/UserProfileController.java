package com.i33jp.backendblog.controller;

import com.i33jp.backendblog.entity.User;
import com.i33jp.backendblog.entity.UserProfile;
import com.i33jp.backendblog.repository.UserProfileRepository;
import com.i33jp.backendblog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user/profile")
public class UserProfileController {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserRepository userRepository; // ✅ Thêm UserRepository
    @GetMapping("/{userId}")
    public ResponseEntity<Object> getUserProfile(@PathVariable Long userId, Authentication authentication) {
        String currentUsername = authentication.getName();

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        // ✅ Kiểm tra nếu user có "ROLE_ADMIN"
        boolean isAdmin = currentUser.getRoles().stream()
                .map(userRole -> userRole.getRole().getName()) // Lấy tên role từ bảng Role
                .anyMatch(roleName -> roleName.equals("ROLE_ADMIN"));
        // ✅ Nếu không phải Admin và không phải chủ tài khoản => Cấm truy cập
        if (!isAdmin && !currentUser.getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You do not have permission to access this profile"));
        }

        Optional<UserProfile> profile = userProfileRepository.findByUserId(userId);
        System.out.println( profile.isPresent());

        // ✅ Trả về thông tin UserProfile nếu tìm thấy
        if (profile.isPresent()) {
            return ResponseEntity.ok(profile.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User profile not found!"));
        }
    }

}

