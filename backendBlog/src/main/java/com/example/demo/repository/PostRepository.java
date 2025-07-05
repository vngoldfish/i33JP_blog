package com.example.demo.repository;

import com.example.demo.entity.Category;
import com.example.demo.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long>, JpaSpecificationExecutor<Post> {
    Optional<Post> findById(Long id);
    Optional<Post> findByIdAndSlug(Long id, String slug);
    @EntityGraph(attributePaths = {"user","category"})
    Page<Post> findAll(Specification<Post> spec, Pageable pageable);
    List<Post> findByCategory(Category category);


}