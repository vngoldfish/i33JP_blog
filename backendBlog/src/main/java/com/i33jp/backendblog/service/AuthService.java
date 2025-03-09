package com.i33jp.backendblog.service;

import com.i33jp.backendblog.entity.RevokedToken;
import com.i33jp.backendblog.entity.Role;
import com.i33jp.backendblog.entity.User;
import com.i33jp.backendblog.entity.UserRole;
import com.i33jp.backendblog.repository.RevokedTokenRepository;
import com.i33jp.backendblog.repository.RoleRepository;
import com.i33jp.backendblog.repository.UserRepository;
import com.i33jp.backendblog.repository.UserRoleRepository;
import com.i33jp.backendblog.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private RevokedTokenRepository revokedTokenRepository;
    @Autowired
    private JwtUtils jwtUtils;
    // 📌 Đăng ký người dùng
    public String registerUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return "Username already exists!";
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            return "Email already exists!";
        }

        // Mã hóa mật khẩu
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Lưu người dùng vào database
        User savedUser = userRepository.save(user);

        // Gán quyền mặc định ROLE_USER cho người dùng mới
        Role userRole = roleRepository.findByName(Role.RoleName.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Role USER not found"));

        UserRole userRoleMapping = new UserRole();
        userRoleMapping.setUser(savedUser);
        userRoleMapping.setRole(userRole);
        userRoleRepository.save(userRoleMapping);

        return "User registered successfully!";
    }

    // 📌 Đăng nhập người dùng
    public Optional<String> authenticateUser(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // ✅ Tạo token và trả về (KHÔNG LƯU VÀO DATABASE)
        String token = jwtUtils.generateToken(user.getUsername());
        return Optional.of(token);
    }
    public void logout(String token, String username) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7); // Cắt "Bearer " để lấy token thực sự
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        RevokedToken revokedToken = new RevokedToken();
        revokedToken.setToken(token);
        revokedToken.setUser(user);
        revokedToken.setRevokedAt(LocalDateTime.now());
        revokedTokenRepository.save(revokedToken);
    }
}
