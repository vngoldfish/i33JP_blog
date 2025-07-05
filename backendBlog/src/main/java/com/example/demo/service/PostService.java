package com.example.demo.service;

import com.example.demo.dto.CategoryDto;
import com.example.demo.dto.PostDetailDto;
import com.example.demo.dto.CreatePostDto;
import com.example.demo.dto.PostSummaryDto;
import com.example.demo.entity.Category;
import com.example.demo.entity.Post;
import com.example.demo.entity.Tag;
import com.example.demo.entity.User;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.PostRepository;
import com.example.demo.repository.TagRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.utils.SlugUtil;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.jsoup.Jsoup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;


    public PostService(PostRepository postRepository, CategoryRepository categoryRepository, UserRepository userRepository, TagRepository tagRepository) {
        this.postRepository = postRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.tagRepository = tagRepository;
    }
    // Phương thức resolveTags
    private Set<Tag> resolveTags(List<Long> tagIds) {
        return tagIds.stream()
                .map(id -> tagRepository.findById(id)
                        .orElseThrow(() -> new EntityNotFoundException("Tag not found: " + id)))
                .collect(Collectors.toSet());
    }
    @Transactional
    public Post createPost(CreatePostDto createPostDto,String username) {
        // Kiểm tra danh mục có tồn tại trong CSDL
        Category category = categoryRepository.findById(createPostDto.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Danh mục không tồn tại."));
        // Tìm tag
        Set<Tag> tags = new HashSet<>(tagRepository.findAllById(createPostDto.getTagIds()));
        if (tags.size() != createPostDto.getTagIds().size()) {
            throw new IllegalArgumentException("Một hoặc nhiều tag không tồn tại.");
        }

        // Tạo bài viết mới
        Post post = new Post();
        post.setTitle(createPostDto.getTitle());
        post.setContent(createPostDto.getContent());
        String slug = SlugUtil.toSlug(createPostDto.getTitle());
        post.setSlug(slug);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng: " + username));


        post.setUser(user);
        post.setCategory(category);

        post.setTags(tags);


        // Lưu bài viết vào database
        return postRepository.save(post);
    }
    public PostDetailDto toDetailDto(Post post) {
        PostDetailDto dto = new PostDetailDto();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setAuthor(post.getUser().getUsername());
        dto.setTagIds(post.getTags()
                .stream()
                .map(Tag::getName)
                .collect(Collectors.toSet()));
        return dto;
    }
    @Transactional
    public PostDetailDto getPostDetail(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Bài viết không tồn tại"));
        List<CategoryDto> breadcrumb = buildBreadcrumb(
                post.getCategory()
        );

        return new PostDetailDto(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getCreatedAt(),
                post.getUser().getUsername(),
                breadcrumb,  // <<== danh mục theo cấp cha → con
                post.getTags().stream().map(Tag::getName).collect(Collectors.toSet()) // tagIds
        );
    }
    @Transactional

    public PostDetailDto getByIdAndSlug(Long id, String slug) {
        Post post = postRepository.findByIdAndSlug(id, slug)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bài viết"));

        return toDetailDto(post);
    }
    @Transactional
    public void deletePost(Long postId, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Bài viết không tồn tại"));

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Người dùng không tồn tại"));

        boolean isAdmin = currentUser.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_ADMIN"));

        if (!isAdmin && !post.getUser().getUsername().equals(username)) {
            throw new AccessDeniedException("Bạn không có quyền xoá bài viết này");
        }

        postRepository.delete(post);
    }
    @Transactional
    public Post updatePost(Long postId, CreatePostDto dto, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Bài viết không tồn tại"));

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Người dùng không tồn tại"));

        boolean isAdmin = currentUser.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_ADMIN"));

        if (!isAdmin && !post.getUser().getUsername().equals(username)) {
            throw new AccessDeniedException("Bạn không có quyền chỉnh sửa bài viết này");
        }

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Danh mục không tồn tại"));

        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setCategory(category);

        return postRepository.save(post);
    }
    public Page<Post> getPosts(int page, int size, Long categoryId, String keyword, Long userId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Specification<Post> spec = Specification.where(null);

        if (categoryId != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("category").get("id"), categoryId)
            );
        }


        if (keyword != null && !keyword.trim().isEmpty()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("title")), "%" + keyword.toLowerCase() + "%"));
        }

        if (userId != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("user").get("id"), userId));
        }

        return postRepository.findAll(spec, pageable);
    }
    public PostSummaryDto toSummaryDto(Post post) {
        PostSummaryDto dto = new PostSummaryDto();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setSlug(post.getSlug());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());

        if (post.getUser() != null) {
            dto.setAuthor(post.getUser().getUsername());
        }

        // Lấy danh sách tên danh mục

        dto.setCategoryName(post.getCategory().getName());

        // ✅ Tạo shortContent
        String plainContent = Jsoup.parse(post.getContent()).text();
        String shortContent = (plainContent.length() > 150)
                ? plainContent.substring(0, 150) + "..."
                : plainContent;
        dto.setShortContent(shortContent);

        return dto;
    }
    public List<CategoryDto> buildBreadcrumb(Category leaf) {
        List<CategoryDto> breadcrumb = new ArrayList<>();
        Category current = leaf;

        while (current != null) {
            breadcrumb.add(0, new CategoryDto(current)); // add vào đầu danh sách
            current = current.getParent();
        }
        return breadcrumb;
    }



}