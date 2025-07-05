package com.example.demo.security;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final JwtUtil jwtUtil;
    private final AuditLoggingFilter auditLoggingFilter; // <-- Thêm dòng này

    public SecurityConfig(JwtUtil jwtUtil, AuditLoggingFilter auditLoggingFilter) {
        this.jwtUtil = jwtUtil;
        this.auditLoggingFilter = auditLoggingFilter;

    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // ✅ Cấu hình CORS
                .csrf(AbstractHttpConfigurer::disable) // ✅ TẮT CSRF HOÀN TOÀN
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // ✅ Bỏ chặn OPTIONS request
                        .requestMatchers("/api/auth/login", "/api/auth/register", "/api/auth/refresh","/api/auth/logout","/api/cloudinary/**").permitAll() // ✅ Cho phép các API này không cần auth
                        .requestMatchers("/api/admin/**").hasRole("ADMIN") // 🔒 Chỉ ADMIN truy cập
                        .requestMatchers("/api/user/**","/api/posts/**","api/categories/**","/api/tags","/api/auth/me").authenticated() // 🔒 User phải đăng nhập
                        .anyRequest().authenticated()
                )
                .addFilterBefore(new JwtFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class) // 🔥 Thêm JwtFilter vào Security
                .addFilterAfter(auditLoggingFilter, JwtFilter.class); // 🟢 CHÍNH LÀ NÓ

        return http.build();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        //configuration.setAllowedOrigins(Collections.singletonList("http://localhost:5173")); // ✅ Frontend URL
        configuration.setAllowedOriginPatterns(List.of("*")); // hoặc .setAllowedOrigins(List.of("*"))
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowCredentials(true); // ✅ Nếu dùng cookie (ví dụ lưu refresh token)
        configuration.setAllowedHeaders(Arrays.asList("Content-Type", "Authorization"));
        configuration.setExposedHeaders(Collections.singletonList("Authorization")); // ✅ Nếu muốn frontend đọc lại token từ response

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


}
