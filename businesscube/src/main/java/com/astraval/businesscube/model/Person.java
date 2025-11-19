package com.astraval.businesscube.model;

public class Person {
    private Long id;
    private String name;
    private Integer age;
    private String imageUrl;

    public Person() {}

    public Person(Long id, String name, Integer age, String imageUrl) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.imageUrl = imageUrl;
    }

    // Getters & setters
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
                "id=" + id + ", name='" + name + '\'' +
                ", age=" + age + ", imageUrl='" + imageUrl + '\'' +
                '}';
    }
}
