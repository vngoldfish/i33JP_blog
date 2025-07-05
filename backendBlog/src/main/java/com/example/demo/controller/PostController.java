package com.example.demo.controller;

import com.example.demo.dto.CreatePostDto;
import com.example.demo.dto.PostDetailDto;
import com.example.demo.dto.PostSummaryDto;
import com.example.demo.entity.Post;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.service.PostService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final CategoryRepository categoryRepository;

    public PostController(PostService postService, CategoryRepository categoryRepository) {
        this.postService = postService;
        this.categoryRepository = categoryRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createPost(@Valid @RequestBody CreatePostDto createPostDto, BindingResult result,@AuthenticationPrincipal String username) {
        // Kiểm tra nếu có lỗi trong validate
        if (result.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result.getAllErrors());
        }
        System.out.printf(createPostDto.getTitle());
        // Tạo bài viết mới
        Post newPost = postService.createPost(createPostDto,username);
        PostDetailDto dto = postService.toDetailDto(newPost);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Tạo bài viết thành công", "data", dto));

    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getPostDetail(@PathVariable Long id) {
        PostDetailDto dto = postService.getPostDetail(id);
        return ResponseEntity.ok(Map.of(
                "message", "Lấy chi tiết bài viết thành công",
                "data", dto
        ));
    }
    @GetMapping("/{id}/slug/{slug}")
    public ResponseEntity<?> getPostBySlug(@PathVariable Long id, @PathVariable String slug) {
        PostDetailDto dto = postService.getByIdAndSlug(id, slug);
        return ResponseEntity.ok(Map.of("message", "Thành công", "data", dto));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id,
                                        @AuthenticationPrincipal String username) {
        postService.deletePost(id, username);
        return ResponseEntity.ok(Map.of("message", "Xoá bài viết thành công"));
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable Long id,
                                        @Valid @RequestBody CreatePostDto dto,
                                        @AuthenticationPrincipal String username) {
        Post updated = postService.updatePost(id, dto, username);
        PostDetailDto responseDto = postService.toDetailDto(updated); // ✨ Convert sang DTO
        return ResponseEntity.ok(Map.of("message", "Cập nhật thành công", "data", responseDto));
    }

    @GetMapping
    public ResponseEntity<?> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long userId
    ) {
        Page<Post> posts = postService.getPosts(page, size, categoryId, keyword, userId);

        // ✅ Chuyển đổi sang DTO
        Page<PostSummaryDto> dtoPage = posts.map(postService::toSummaryDto);

        return ResponseEntity.ok(Map.of(
                "message", "Lấy danh sách bài viết thành công",
                "data", dtoPage.getContent(),
                "currentPage", dtoPage.getNumber(),
                "totalItems", dtoPage.getTotalElements(),
                "totalPages", dtoPage.getTotalPages()
        ));
    }


}