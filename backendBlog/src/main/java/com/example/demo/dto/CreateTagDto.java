package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateTagDto {
    @NotBlank(message = "Tên tag không được để trống")
    private String name;
    public CreateTagDto(String name) {
        this.name = name;
    }
}
