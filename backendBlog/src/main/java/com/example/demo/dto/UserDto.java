package com.example.demo.dto;


import com.example.demo.entity.Gender;
import jakarta.persistence.Entity;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String username;
    private String email;
    private List<String> roles;
    private String fullName;
    private String avatarUrl;
    private String bio;
    private String phoneNumber;
    private Gender gender;
    private String address;

}
