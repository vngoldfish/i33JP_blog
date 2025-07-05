package com.example.demo.service;

import com.example.demo.dto.CreateTagDto;
import com.example.demo.dto.TagDto;
import com.example.demo.entity.Tag;
import com.example.demo.repository.TagRepository;
import com.example.demo.utils.SlugUtil;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {
    private final TagRepository tagRepository;

    // Lấy tất cả tags
    public List<TagDto> getAllTags() {
        List<Tag> tags = tagRepository.findAll();

        return tags.stream().map(tag -> {
            TagDto dto = new TagDto();
            dto.setId(tag.getId());
            dto.setName(tag.getName());
            dto.setSlug(tag.getSlug());
            return dto;
        }).collect(Collectors.toList());

    }


    // Tạo mới tag
    public CreateTagDto createTag(CreateTagDto dto) {
        if (tagRepository.existsByName(dto.getName())) {
            throw new EntityExistsException("Tag already exists");
        }
        Tag tag = new Tag();
        tag.setName(dto.getName());
        String slug = SlugUtil.toSlug(dto.getName());
        tag.setSlug(slug);
        tag = tagRepository.save(tag);
        return new CreateTagDto(tag.getName());
    }

    // Chỉnh sửa tag
    public TagDto editTag(Long id, TagDto tagDto) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tag not found: " + id));

        tag.setName(tagDto.getName());
        tag.setSlug(tagDto.getSlug());
        tag = tagRepository.save(tag);
        TagDto dto = new TagDto();
        dto.setName(tag.getName());
        return dto;
    }

    // Xóa tag
    public void deleteTag(Long id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tag not found: " + id));

        tagRepository.delete(tag);
    }
}
