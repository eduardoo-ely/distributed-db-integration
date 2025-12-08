package com.academia.bancos.model;

import java.util.Objects;

/**
 * Modelo para credenciais de usuário (PostgreSQL)
 * Armazena apenas dados de autenticação
 */

public class UserCredential {
    private String userId;
    private String email;
    private String passwordHash;

    public UserCredential() {}

    public UserCredential(String userId, String email, String passwordHash) {
        this.userId = userId;
        this.email = email;
        this.passwordHash = passwordHash;
    }

    // Getters e Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserCredential that = (UserCredential) o;
        return Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId);
    }

    @Override
    public String toString() {
        return "UserCredential{" +
                "userId='" + userId + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}