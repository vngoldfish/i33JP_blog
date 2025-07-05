package com.example.demo.service;

import com.example.demo.dto.CreateTagDto;
import com.example.demo.dto.TagDto;

import java.util.List;

public interface TagService {
    List<TagDto> getAllTags();
    CreateTagDto createTag(CreateTagDto dto);
    TagDto editTag(Long id, TagDto tagDTO);  // Phương thức chỉnh sửa tag
    void deleteTag(Long id);  // Phương thức xóa tag
}
