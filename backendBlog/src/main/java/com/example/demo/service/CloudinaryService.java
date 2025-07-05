package com.example.demo.service;


import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService() {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dhatwtfyg",
                "api_key", "219174328855417",
                "api_secret", "JvPD8m9rrWDbNGs4jzNglfxOIXQ"));
    }

    public String uploadFile(MultipartFile file) throws IOException {

        //Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        //Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
        //        "folder", "my-app"
        //));
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "folder", "my-app",
                "transformation", new Transformation().width(1024).height(1024).crop("limit").quality("auto")
        ));


        return (String) uploadResult.get("secure_url"); // Link ảnh
    }
    public List<String> listImages() throws Exception {
        Map result = cloudinary.api().resources(ObjectUtils.asMap(
                "type", "upload",
                //"resource_type", "image",
                "prefix", "my-app/", // lấy ảnh chỉ trong folder my-app
                "max_results", 50
        ));

        List<Map> resources = (List<Map>) result.get("resources");
        return resources.stream()
                .map(r -> (String) r.get("secure_url"))
                .collect(Collectors.toList());
    }


}

