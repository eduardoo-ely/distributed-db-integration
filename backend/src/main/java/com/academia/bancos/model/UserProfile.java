package com.academia.bancos.model;

import java.util.List;
import java.util.Objects;

/**
 * Modelo para perfil de usuário (MongoDB)
 * Armazena dados demográficos e preferências
 */

public class UserProfile {
    private String userId;
    private Integer age;
    private String country;
    private String subscriptionType;
    private String device;
    private List<String> genres;
    private String gender;
    private Double monthlyRevenue;

    public UserProfile() {}

    public UserProfile(String userId, Integer age, String country,
                       String subscriptionType, String device,
                       List<String> genres, String gender, Double monthlyRevenue) {
        this.userId = userId;
        this.age = age;
        this.country = country;
        this.subscriptionType = subscriptionType;
        this.device = device;
        this.genres = genres;
        this.gender = gender;
        this.monthlyRevenue = monthlyRevenue;
    }

    // Getters e Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getSubscriptionType() {
        return subscriptionType;
    }

    public void setSubscriptionType(String subscriptionType) {
        this.subscriptionType = subscriptionType;
    }

    public String getDevice() {
        return device;
    }

    public void setDevice(String device) {
        this.device = device;
    }

    public List<String> getGenres() {
        return genres;
    }

    public void setGenres(List<String> genres) {
        this.genres = genres;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Double getMonthlyRevenue() {
        return monthlyRevenue;
    }

    public void setMonthlyRevenue(Double monthlyRevenue) {
        this.monthlyRevenue = monthlyRevenue;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserProfile that = (UserProfile) o;
        return Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId);
    }

    @Override
    public String toString() {
        return "UserProfile{" +
                "userId='" + userId + '\'' +
                ", age=" + age +
                ", country='" + country + '\'' +
                ", subscriptionType='" + subscriptionType + '\'' +
                ", device='" + device + '\'' +
                ", genres=" + genres +
                ", gender='" + gender + '\'' +
                ", monthlyRevenue=" + monthlyRevenue +
                '}';
    }
}