package com.astraval.businesscube.service;

import com.astraval.businesscube.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.sql.SQLException;
import java.util.*;

@Service
public class PersonService {

    @Autowired
    private PersonRepository repo;

    @Value("${upload.path}")
    private String uploadPath;

    private void ensureUploadDir() {
        File dir = new File(uploadPath);
        if (!dir.exists()) dir.mkdirs();
    }

    private String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;
        if (file.getSize() > 10L * 1024 * 1024) {
            throw new RuntimeException("File too large. Max allowed is 10MB.");
        }
        ensureUploadDir();
        String fn = UUID.randomUUID() + "_" + file.getOriginalFilename();
        File target = new File(uploadPath, fn);
        file.transferTo(target);
        return "/uploads/" + fn;
    }

    private void deleteFile(String imageUrl) {
        if (imageUrl == null) return;
        File f = new File(uploadPath, imageUrl.replace("/uploads/", ""));
        if (f.exists()) f.delete();
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

    public String delete(Long id) throws SQLException {
        String old = repo.findImageUrlById(id);
        repo.delete(id);
        if (old != null) deleteFile(old);
        return "Person deleted successfully";
    }
}
