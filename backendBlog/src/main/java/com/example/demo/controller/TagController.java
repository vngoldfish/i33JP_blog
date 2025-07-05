package com.example.demo.controller;

import com.example.demo.dto.CreateTagDto;
import com.example.demo.dto.TagDto;
import com.example.demo.service.TagService;
import com.example.demo.service.TagServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
@CrossOrigin("*") // để gọi từ frontend
public class TagController {

    private final TagService tagService;

    // API lấy tất cả tag
    @GetMapping
    public ResponseEntity<List<TagDto>> getAllTags() {
        List<TagDto> tags = tagService.getAllTags();
        return ResponseEntity.ok(tags);
    }

    // API tạo mới tag
    @PostMapping
    public ResponseEntity<CreateTagDto> createTag(@RequestBody CreateTagDto dto) {
        CreateTagDto newTag = tagService.createTag(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newTag);
    }

    // API chỉnh sửa tag
    @PutMapping("/{id}")
    public ResponseEntity<TagDto> editTag(@PathVariable Long id, @RequestBody TagDto tagDto) {
        TagDto updatedTag = tagService.editTag(id, tagDto);
        return ResponseEntity.ok(updatedTag);
    }

    // API xóa tag
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
        return ResponseEntity.noContent().build();  // Trả về HTTP 204 No Content
    }
}
