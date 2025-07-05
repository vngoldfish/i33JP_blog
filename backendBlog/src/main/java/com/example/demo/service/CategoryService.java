package com.example.demo.service;

import com.example.demo.dto.CategoryDto;
import com.example.demo.dto.FormCategoryDto;

import java.util.List;

public interface CategoryService {
    List<CategoryDto> getAllCategoriesTree();
    CategoryDto getCategory(Long id);
    CategoryDto createCategory(FormCategoryDto form);
    CategoryDto updateCategory(Long id, FormCategoryDto form);
    void deleteCategory(Long id);
}
