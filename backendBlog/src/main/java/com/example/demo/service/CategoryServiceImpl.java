package com.example.demo.service;

import com.example.demo.dto.CategoryDto;
import com.example.demo.dto.FormCategoryDto;
import com.example.demo.entity.Category;
import com.example.demo.entity.Post;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.PostRepository;
import com.example.demo.utils.SlugUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService{
    private final CategoryRepository categoryRepo;

    private final PostRepository postRepository;
    @Override
    @Transactional
    public List<CategoryDto> getAllCategoriesTree() {
        List<Category> roots = categoryRepo.findByParentIsNull();
        return roots.stream().map(this::toDtoWithChildren).collect(Collectors.toList());
    }

    private CategoryDto toDtoWithChildren(Category category) {
        CategoryDto dto = new CategoryDto(
                category.getId(),
                category.getName(),
                category.getParent() != null ? category.getParent().getId() : null,
                new ArrayList<>()
        );
        dto.setChildren(category.getChildren().stream()
                .map(this::toDtoWithChildren).collect(Collectors.toList()));
        return dto;
    }

    @Override
    public CategoryDto getCategory(Long id) {
        Category category = categoryRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
        return toDto(category);
    }

    @Override
    public CategoryDto createCategory(FormCategoryDto form) {
        Category category = new Category();
        category.setName(form.getName());
        if (form.getParentId() != null) {
            Category parent = categoryRepo.findById(form.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent not found"));
            category.setParent(parent);
        }
        String slug = SlugUtil.toSlug(form.getName());
        category.setSlug(slug);
        Category saved = categoryRepo.save(category);
        return toDto(saved);
    }

    @Override
    public CategoryDto updateCategory(Long id, FormCategoryDto form) {
        Category category = categoryRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
        category.setName(form.getName());
        if (form.getParentId() != null) {
            Category parent = categoryRepo.findById(form.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent not found"));
            category.setParent(parent);
        } else {
            category.setParent(null);
        }
        Category updated = categoryRepo.save(category);
        return toDto(updated);
    }

    @Override
    public void deleteCategory(Long id) {
        Category categoryToDelete = categoryRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục"));

        Category defaultCategory = categoryRepo.findById(1L)
                .orElseThrow(() -> new IllegalStateException("Chưa có danh mục mặc định"));

        // Tìm tất cả bài viết thuộc danh mục cần xoá
        List<Post> posts = postRepository.findByCategory(categoryToDelete);

        for (Post post : posts) {
            post.setCategory(defaultCategory);  // Gán lại danh mục mặc định
        }

        categoryRepo.deleteById(id);
    }

    private CategoryDto toDto(Category category) {
        return new CategoryDto(
                category.getId(),
                category.getName(),
                category.getParent() != null ? category.getParent().getId() : null,
                null
        );
    }

}
