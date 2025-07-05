package com.example.demo.dto;

import com.example.demo.entity.Gender;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String fullName;
    private String avatarUrl;
    private String bio;
    private String phoneNumber;
    private String address;
    private Gender gender; // enum
}
