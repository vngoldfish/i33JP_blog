package com.example.demo.dto;

import com.example.demo.entity.Category;
import com.example.demo.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jsoup.Jsoup;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostSummaryDto {
    private Long id;
    private String title;
    private String slug;
    private String author; // Tên người đăng bài
    private String categoryName;
    private List<Long> tagIds;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String shortContent; // ✅ đoạn trích nội dung

}