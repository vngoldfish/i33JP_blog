package com.example.demo.security;

public enum ActionType {
    VIEW_USER("Xem danh sách người dùng"),
    LOGIN("Đăng nhập"),
    LOGOUT("Đăng xuất"),
    CREATE_POST("Tạo bài viết"),
    DELETE_POST("Xóa bài viết"),
    ACCESS_API("Truy cập API");

    private final String description;

    ActionType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
