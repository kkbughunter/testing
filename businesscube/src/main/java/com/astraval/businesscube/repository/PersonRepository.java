package com.astraval.businesscube.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.*;

@Repository
public class PersonRepository {

    @Autowired
    private DataSource dataSource;

    public long insert(String name, Integer age, String imageUrl) throws SQLException {
        String sql = "INSERT INTO persons (name, age, image_url) VALUES (?, ?, ?) RETURNING id";
        try (Connection con = dataSource.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, name);
            ps.setInt(2, age);
            ps.setString(3, imageUrl);
            ResultSet rs = ps.executeQuery();
            rs.next();
            return rs.getLong(1);
        }
    }

    public List<Map<String, Object>> findAll() throws SQLException {
        String sql = "SELECT id, name, age, image_url FROM persons ORDER BY id ASC";
        List<Map<String, Object>> list = new ArrayList<>();
        try (Connection con = dataSource.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("id", rs.getLong("id"));
                m.put("name", rs.getString("name"));
                m.put("age", rs.getInt("age"));
                m.put("imageUrl", rs.getString("image_url"));
                list.add(m);
            }
        }
        return list;
    }

    public String findImageUrlById(Long id) throws SQLException {
        String sql = "SELECT image_url FROM persons WHERE id=?";
        try (Connection con = dataSource.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setLong(1, id);
            ResultSet rs = ps.executeQuery();
            return rs.next() ? rs.getString(1) : null;
        }
    }

    public void update(Long id, String name, Integer age, String imageUrl) throws SQLException {
        String sql = imageUrl != null
                ? "UPDATE persons SET name=?, age=?, image_url=? WHERE id=?"
                : "UPDATE persons SET name=?, age=? WHERE id=?";
        try (Connection con = dataSource.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, name);
            ps.setInt(2, age);
            if (imageUrl != null) {
                ps.setString(3, imageUrl);
                ps.setLong(4, id);
            } else {
                ps.setLong(3, id);
            }
            ps.executeUpdate();
        }
    }

    public void delete(Long id) throws SQLException {
        String sql = "DELETE FROM persons WHERE id=?";
        try (Connection con = dataSource.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setLong(1, id);
            ps.executeUpdate();
        }
    }
}
