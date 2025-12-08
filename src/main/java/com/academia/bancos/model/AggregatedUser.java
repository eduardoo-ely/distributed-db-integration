package com.academia.bancos.model;

import java.util.Objects;

/**
 * Modelo agregado que une dados de todos os bancos
 * Representa a visão completa do usuário
 */

public class AggregatedUser {
    private UserCredential credentials;  // PostgreSQL
    private UserProfile profile;         // MongoDB
    private UserGraph relations;         // Neo4j
    private Integer loginCount;          // Redis

    public AggregatedUser() {}

    public AggregatedUser(UserCredential credentials, UserProfile profile,
                          UserGraph relations, Integer loginCount) {
        this.credentials = credentials;
        this.profile = profile;
        this.relations = relations;
        this.loginCount = loginCount;
    }

    // Getters e Setters
    public UserCredential getCredentials() {
        return credentials;
    }

    public void setCredentials(UserCredential credentials) {
        this.credentials = credentials;
    }

    public UserProfile getProfile() {
        return profile;
    }

    public void setProfile(UserProfile profile) {
        this.profile = profile;
    }

    public UserGraph getRelations() {
        return relations;
    }

    public void setRelations(UserGraph relations) {
        this.relations = relations;
    }

    public Integer getLoginCount() {
        return loginCount;
    }

    public void setLoginCount(Integer loginCount) {
        this.loginCount = loginCount;
    }

    public String getUserId() {
        return credentials != null ? credentials.getUserId() : null;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AggregatedUser that = (AggregatedUser) o;
        return Objects.equals(getUserId(), that.getUserId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getUserId());
    }

    @Override
    public String toString() {
        return "AggregatedUser{" +
                "userId='" + getUserId() + '\'' +
                ", email='" + (credentials != null ? credentials.getEmail() : null) + '\'' +
                ", country='" + (profile != null ? profile.getCountry() : null) + '\'' +
                ", followers=" + (relations != null ? relations.getFollowersCount() : 0) +
                ", loginCount=" + loginCount +
                '}';
    }
}