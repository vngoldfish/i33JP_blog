package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateCategoryDto {

    @NotBlank(message = "Tên danh mục không được để trống")
    private String name;

    private Long parentId; // nếu muốn tạo danh mục con
}
