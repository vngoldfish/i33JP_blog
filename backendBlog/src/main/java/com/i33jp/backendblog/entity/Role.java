package com.i33jp.backendblog.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)  // Chuyển name thành ENUM thay vì String
    @Column(length = 20, nullable = false, unique = true)
    private RoleName name;

    public enum RoleName {
        ROLE_USER, ROLE_ADMIN
    }
}
