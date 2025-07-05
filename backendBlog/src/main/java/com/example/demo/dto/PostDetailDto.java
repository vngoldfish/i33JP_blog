package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostDetailDto {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private String author; // Tên người tạo
    private List<CategoryDto> breadcrumb;
    private Set<String> tagIds;
}