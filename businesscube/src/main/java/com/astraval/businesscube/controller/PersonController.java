package com.astraval.businesscube.controller;

import com.astraval.businesscube.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/persons")
public class PersonController {

    @Autowired
    private PersonService personService;

    @PostMapping("/create")
    public Map<String, Object> createPerson(
            @RequestParam String name,
            @RequestParam Integer age,
            @RequestParam(required = false) MultipartFile image
    ) throws SQLException, IOException {
        return personService.create(name, age, image);
    }

    @GetMapping
    public List<Map<String, Object>> getAll() throws SQLException {
        return personService.all();
    }

    @PutMapping("/update/{id}")
    public Map<String, Object> updatePerson(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam Integer age,
            @RequestParam(required = false) MultipartFile image
    ) throws SQLException, IOException {
        return personService.update(id, name, age, image);
    }

    @DeleteMapping("/delete/{id}")
    public String deletePerson(@PathVariable Long id) throws SQLException, IOException {
        return personService.delete(id);
    }

}
