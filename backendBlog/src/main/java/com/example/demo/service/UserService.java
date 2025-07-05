package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.entity.RevokedToken;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.entity.UserProfile;
import com.example.demo.repository.RevokedTokenRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.ActionType;
import com.example.demo.security.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final JwtUtil jwtUtil;
    private final RevokedTokenRepository revokedTokenRepository;
    private final AuditLogService auditLogService;
    private final RevokedTokenService revokedTokenService;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, JwtUtil jwtUtil, RevokedTokenRepository revokedTokenRepository, AuditLogService auditLogService, RevokedTokenService revokedTokenService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtUtil = jwtUtil;
        this.revokedTokenRepository = revokedTokenRepository;
        this.auditLogService = auditLogService;
        this.revokedTokenService = revokedTokenService;
    }

    // Đăng ký User với Role
    public User registerUser(RegisterRequestDto dto) {
        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }
        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            throw new IllegalArgumentException("Mật khẩu xác nhận không khớp");
        }

        // ✅ Lấy ROLE_USER từ database
        Optional<Role> roleOpt = roleRepository.findByName("ROLE_USER");
        if (roleOpt.isEmpty()) {
            throw new IllegalArgumentException("Default role ROLE_USER not found in database");
        }

        Role defaultRole = roleOpt.get();

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEmail(dto.getEmail());

        // ✅ Luôn gán ROLE_USER khi đăng ký
        user.setRoles(new HashSet<>(Set.of(defaultRole)));

        // Tạo profile
        UserProfile profile = new UserProfile();
        profile.setFullName(dto.getFullName());
        profile.setGender(dto.getGender());
        profile.setUser(user);

        user.setProfile(profile);

        return userRepository.save(user);
    }

    // Kiểm tra thông tin đăng nhập
    public boolean login(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        return userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword());
    }
    public LoginResponseDto handleLogin(LoginRequestDto request,
                                        HttpServletResponse response,
                                        HttpServletRequest httpRequest) {
        String username = request.getUsername();
        String password = request.getPassword();

        if (!login(username, password)) {
            throw new IllegalArgumentException("Tài khoản hoặc mật khẩu không đúng");
        }

        String role = getUserRole(username);
        String accessToken = jwtUtil.generateToken(username, role);
        String refreshToken = jwtUtil.generateRefreshToken(username);

        response.addHeader("Set-Cookie", jwtUtil.createRefreshTokenCookie(refreshToken).toString());

        User user = findByUsername(username);
        UserProfile profile = user.getProfile();

        String fullName = profile != null ? profile.getFullName() : null;
        String avatarUrl = profile != null ? profile.getAvatarUrl() : null;

        auditLogService.saveLog(httpRequest, ActionType.LOGIN);

        return new LoginResponseDto(
                "Login successful",
                username,
                role,
                accessToken,
                fullName,
                avatarUrl
        );
    }

    public List<UserDto> getAllUsers() {

        return userRepository.findAll().stream().map(user -> {
                    UserProfile profile = user.getProfile();
                    String gender = profile != null && profile.getGender() != null
                    ? profile.getGender().toString()
                    : null;

                    return new UserDto(
                            user.getUsername(),
                            user.getEmail(),
                            user.getRoles().stream()
                                    .map(Role::getName) // lấy tên role
                                    .collect(Collectors.toList()),
                            profile != null ? profile.getFullName() : null,
                            profile != null ? profile.getAvatarUrl() : null,
                            profile != null ? profile.getBio() : null,
                            profile != null ? profile.getPhoneNumber() : null,
                            profile != null ? profile.getGender() : null,
                            profile != null ? profile.getAddress() : null
                    );
                }).collect(Collectors.toList());
    }
    public Page<User> getUsers(int page,int size,String keyword){
        Pageable pageable = PageRequest.of(page,size, Sort.by("createdAt").descending());
        Specification<User> spec = Specification.where(null);
        if(keyword != null && !keyword.trim().isEmpty()){
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("username")),"%" + keyword.toLowerCase() + "%"));
        }
        return userRepository.findAll(spec,pageable);
    }
    public UserDto toUserDto(User user){
        UserProfile profile = user.getProfile();
        String gender = profile != null && profile.getGender() != null
                ? profile.getGender().toString()
                : null;
        UserDto dto = new UserDto();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toList()));
        dto.setGender(profile != null ? profile.getGender() : null);
        dto.setFullName(profile != null ? profile.getFullName() : null);
        dto.setAvatarUrl(profile != null ? profile.getAvatarUrl() : null);
        dto.setBio(profile != null ? profile.getBio() : null);
        dto.setPhoneNumber(profile != null ? profile.getPhoneNumber() : null);
        dto.setAddress(profile != null ? profile.getAddress() : null);
                return dto;

    }
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy user: " + username));
    }
    public void updateProfile(String username, UpdateProfileRequest dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        UserProfile profile = user.getProfile();
        if (profile == null) {
            profile = new UserProfile();
            profile.setUser(user);
            user.setProfile(profile);
        }

        profile.setFullName(dto.getFullName());
        profile.setAvatarUrl(dto.getAvatarUrl());
        profile.setBio(dto.getBio());
        profile.setPhoneNumber(dto.getPhoneNumber());
        profile.setAddress(dto.getAddress());
        profile.setGender(dto.getGender());

        userRepository.save(user); // do cascade ALL nên profile cũng tự lưu
    }
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = jwtUtil.getTokenFromCookie(request, "REFRESH_TOKEN");

        if (refreshToken == null || refreshToken.isBlank()) {
            throw new IllegalStateException("Bạn chưa đăng nhập.");
        }

        if (!jwtUtil.isTokenValid(refreshToken, true)) {
            jwtUtil.removeJwtCookie(response);
            throw new JwtException("Refresh token không hợp lệ. Đã đăng xuất.");
        }

        // ✅ 1. Lấy claims để lấy thời điểm hết hạn
        Claims claims = jwtUtil.extractClaims(refreshToken, true);
        Date expirationDate = claims.getExpiration(); // UTC
        LocalDateTime expiredAt = expirationDate.toInstant()
                .atZone(ZoneId.of("Asia/Tokyo")) // hoặc "Asia/Ho_Chi_Minh"
                .toLocalDateTime();
        // ✅ 2. Lấy user
        String username = claims.getSubject(); // hoặc extractUsername()
        User user = findByUsername(username);

        // ✅ 3. Tạo token blacklist
        RevokedToken revoked = new RevokedToken();
        revoked.setToken(refreshToken);
        revoked.setRevokedAt(LocalDateTime.now());
        revoked.setExpiredAt(expiredAt);



        revoked.setUser(user);

        revokedTokenRepository.save(revoked);

        jwtUtil.removeJwtCookie(response);
    }

    public Map<String, Object> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = jwtUtil.getTokenFromCookie(request, "REFRESH_TOKEN");
        if (revokedTokenService.isRevoked(refreshToken)) {
            jwtUtil.removeJwtCookie(response);
            throw new IllegalStateException("Token đã bị thu hồi. Vui lòng đăng nhập lại.");
        }
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new IllegalStateException("Không tìm thấy Refresh Token. Vui lòng đăng nhập lại.");
        }

        String username = jwtUtil.extractUsername(refreshToken, true);

        if (!jwtUtil.isTokenValid(refreshToken, true)) {
            jwtUtil.removeJwtCookie(response);
            throw new JwtException("Refresh Token không hợp lệ.");
        }

        String role = getUserRole(username);
        String newAccessToken = jwtUtil.generateToken(username, role);
        String newRefreshToken = jwtUtil.generateRefreshToken(username);

        // Cập nhật lại cookie
        response.addHeader("Set-Cookie", jwtUtil.createRefreshTokenCookie(newRefreshToken).toString());

        return Map.of(
                "accessToken", newAccessToken,
                "message", "Token đã được làm mới"
        );
    }
    public String getUserRole(String username) {
        User user = findByUsername(username); // hoặc userRepository.findByUsername
        return user.getRoles().stream()
                .findFirst() // ✅ nếu 1 user chỉ có 1 role
                .map(Role::getName)
                .orElseThrow(() -> new RuntimeException("User has no role"));
    }

}
