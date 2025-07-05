package com.example.demo.controller;

import com.example.demo.dto.CategoryDto;
import com.example.demo.dto.CreateCategoryDto;
import com.example.demo.dto.FormCategoryDto;
import com.example.demo.entity.Category;
import com.example.demo.service.CategoryService;
import com.example.demo.service.CategoryServicev1;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin("*") // để gọi từ frontend
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public List<CategoryDto> getAll() {
        return categoryService.getAllCategoriesTree();
    }

    @GetMapping("/{id}")
    public CategoryDto getOne(@PathVariable Long id) {
        return categoryService.getCategory(id);
    }

    @PostMapping
    public CategoryDto create(@RequestBody FormCategoryDto form) {
        return categoryService.createCategory(form);
    }

    @PutMapping("/{id}")
    public CategoryDto update(@PathVariable Long id, @RequestBody FormCategoryDto form) {
        return categoryService.updateCategory(id, form);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }
}


