package com.example.demo.controller;

import com.example.demo.dto.PostSummaryDto;
import com.example.demo.dto.UpdateProfileRequest;
import com.example.demo.dto.UserDto;
import com.example.demo.entity.Post;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.entity.UserProfile;
import com.example.demo.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // ✅ Bật CORS cho phép cookie
public class UserController {
    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        Page<User> users = userService.getUsers(page, size, keyword);
        // ✅ Chuyển đổi sang DTO
        Page<UserDto> dtoPage = users.map(userService::toUserDto);

        return ResponseEntity.ok(Map.of(
                "message", "Lấy danh sách User thành công",
                "data", dtoPage.getContent(),
                "currentPage", dtoPage.getNumber(),
                "totalItems", dtoPage.getTotalElements(),
                "totalPages", dtoPage.getTotalPages()
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal String username) {
        User user = userService.findByUsername(username); // Lấy thông tin từ DB
        UserProfile profile = user.getProfile();

        // Tạo DTO trả về
        UserDto dto = new UserDto();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRoles(user.getRoles().stream().map(Role::getName).toList());

        if (profile != null) {
            dto.setFullName(profile.getFullName());
            dto.setAvatarUrl(profile.getAvatarUrl());
            dto.setPhoneNumber(profile.getPhoneNumber());
            dto.setAddress(profile.getAddress());
            // các field khác nếu cần
        }

        return ResponseEntity.ok(dto);
    }
    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest dto,
                                           @AuthenticationPrincipal String username) {
        userService.updateProfile(username, dto);
        return ResponseEntity.ok(Map.of("message", "Cập nhật thành công"));
    }




}
