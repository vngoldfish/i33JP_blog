package com.i33jp.backendblog.repository;

import com.i33jp.backendblog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Tìm người dùng theo username
    Optional<User> findByUsername(String username);

    // Tìm người dùng theo email
    Optional<User> findByEmail(String email);

    // Kiểm tra xem username đã tồn tại chưa
    boolean existsByUsername(String username);

    // Kiểm tra xem email đã tồn tại chưa
    boolean existsByEmail(String email);
}
