package com.astraval.businesscube.service;

import com.astraval.businesscube.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.util.*;

@Service
public class PersonService {

    @Autowired
    private PersonRepository repo;

    @Value("${upload.path}")
    private String uploadPath;

    // Returns absolute path and creates folder if it doesn't exist
    private Path getUploadDir() throws IOException {
        Path uploadDir = Paths.get(System.getProperty("user.dir")).resolve(uploadPath);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }
        return uploadDir;
    }

    private String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;
        if (file.getSize() > 10L * 1024 * 1024) {
            throw new RuntimeException("File too large. Max allowed is 10MB.");
        }

        Path uploadDir = getUploadDir();
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path target = uploadDir.resolve(filename);
        file.transferTo(target.toFile());

        return "/uploads/" + filename;
    }

    private void deleteFile(String imageUrl) throws IOException {
        if (imageUrl == null) return;

        Path uploadDir = getUploadDir();
        Path filePath = uploadDir.resolve(imageUrl.replace("/uploads/", ""));
        Files.deleteIfExists(filePath);
    }

    public Map<String, Object> create(String name, Integer age, MultipartFile image) throws SQLException, IOException {
        String imageUrl = saveFile(image);
        long id = repo.insert(name, age, imageUrl);
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("id", id);
        res.put("name", name);
        res.put("age", age);
        res.put("imageUrl", imageUrl);
        return res;
    }

    public List<Map<String, Object>> all() throws SQLException {
        return repo.findAll();
    }

    public Map<String, Object> update(Long id, String name, Integer age, MultipartFile image) throws SQLException, IOException {
        String old = repo.findImageUrlById(id);
        String newUrl = saveFile(image);

        if (newUrl != null && old != null) deleteFile(old);

        repo.update(id, name, age, newUrl);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("id", id);
        res.put("name", name);
        res.put("age", age);
        res.put("imageUrl", newUrl != null ? newUrl : old);
        return res;
    }

    public String delete(Long id) throws SQLException, IOException {
        String old = repo.findImageUrlById(id);
        repo.delete(id);
        if (old != null) deleteFile(old);
        return "Person deleted successfully";
    }
}
