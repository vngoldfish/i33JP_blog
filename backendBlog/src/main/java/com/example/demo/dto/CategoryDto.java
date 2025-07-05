package com.example.demo.dto;

import com.example.demo.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDto {
    private Long id;
    private String name;
    private Long parentId;
    private List<CategoryDto> children = new ArrayList<>();

    public CategoryDto(Category current) {
        this.id = current.getId();
        this.name = current.getName();
        this.parentId = current.getParent() != null ? current.getParent().getId() : null;
    }

}

