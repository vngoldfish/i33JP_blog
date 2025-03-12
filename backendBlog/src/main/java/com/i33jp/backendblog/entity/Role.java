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


    @Column(length = 20, nullable = false, unique = true)
    private String name;
  /*
    public enum RoleName {
        ROLE_USER, ROLE_ADMIN
    }


   */
}
