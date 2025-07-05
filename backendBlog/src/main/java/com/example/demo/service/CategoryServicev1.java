package com.example.demo.service;

import com.example.demo.dto.CreateCategoryDto;
import com.example.demo.entity.Category;
import com.example.demo.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryServicev1 {

    private final CategoryRepository categoryRepository;

    public Category createCategory(CreateCategoryDto dto) {
        Category category = new Category();
        category.setName(dto.getName());

        // Nếu có parentId thì gán parent
        if (dto.getParentId() != null) {
            Category parent = categoryRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("Parent category không tồn tại"));
            category.setParent(parent);
        }

        return categoryRepository.save(category);
    }
}