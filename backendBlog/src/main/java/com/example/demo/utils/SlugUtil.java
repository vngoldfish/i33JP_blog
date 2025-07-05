package com.example.demo.utils;

import java.text.Normalizer;

public class SlugUtil {
    public static String toSlug(String input) {
        String slug = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "") // bỏ dấu
                .replaceAll("[^\\w\\s-]", "") // bỏ ký tự đặc biệt
                .replaceAll("[-\\s]+", "-") // thay khoảng trắng bằng gạch ngang
                .toLowerCase()
                .trim();
        return slug;
    }
}
