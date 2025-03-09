package com.i33jp.backendblog.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class RevokedToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;  // JWT Token đã bị thu hồi

    @Column(nullable = false)
    private LocalDateTime revokedAt; // Thời gian bị thu hồi

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // Người dùng đã đăng xuất

    public RevokedToken() {
        this.revokedAt = LocalDateTime.now();
    }
}
