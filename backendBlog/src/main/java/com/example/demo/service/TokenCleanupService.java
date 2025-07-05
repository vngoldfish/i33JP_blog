package com.example.demo.service;

import com.example.demo.repository.RevokedTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TokenCleanupService {

    private final RevokedTokenRepository revokedTokenRepository;

    @Scheduled(cron = "0 0 0 * * *") // ✅ mỗi giờ 0 phút (ví dụ: 00:00, 01:00, 02:00...)
    public void deleteExpiredTokens() {
        System.out.printf("dang chay");
        LocalDateTime now = LocalDateTime.now();
        revokedTokenRepository.deleteByExpiredAtBefore(now);
    }
}
