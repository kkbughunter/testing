package com.astraval.businesscube.model;

import jakarta.persistence.*;

@Entity
@Table(name = "persons")
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // auto-increment in PostgreSQL
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "age")
    private Integer age;

    @Column(name = "image_url")
    private String imageUrl;

    // Required zero-arg constructor
    public Person() {}

    // Constructor with fields
    public Person(Long id, String name, Integer age, String imageUrl) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.imageUrl = imageUrl;
    }

    // Getters and setters (unchanged)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    @Override
    public String toString() {
        return "Person{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", age=" + age +
                ", imageUrl='" + imageUrl + '\'' +
                '}';
    }
}