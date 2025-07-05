package com.example.demo.security;

import com.example.demo.service.AuditLogService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class AuditLoggingFilter extends OncePerRequestFilter {

    private final AuditLogService auditLogService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // 👉 Gọi tiếp các filter trong chuỗi
        filterChain.doFilter(request, response);

        // 👉 Gọi sau khi request đã xử lý xong (response sẵn sàng trả về)
        String uri = request.getRequestURI();
        if (!uri.startsWith("/api/auth")) {
            auditLogService.saveLog(request, ActionType.ACCESS_API);
            //auditLogService.saveLog(request, ActionType.LOGIN);

        }
    }
}


