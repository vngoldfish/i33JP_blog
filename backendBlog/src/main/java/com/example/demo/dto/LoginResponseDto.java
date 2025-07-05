package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDto {
    private String message;
    private String username;
    private String role;
    private String accessToken;
    private String fullName;
    private String avatarUrl;
}

