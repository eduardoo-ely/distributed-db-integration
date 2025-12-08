package com.academia.bancos.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Modelo para relações de grafo (Neo4j)
 * Armazena seguidores
 */

public class UserGraph {
    private List<String> followers;
    private List<String> following;

    public UserGraph() {
        this.followers = new ArrayList<>();
        this.following = new ArrayList<>();
    }

    public UserGraph(List<String> followers, List<String> following) {
        this.followers = followers != null ? followers : new ArrayList<>();
        this.following = following != null ? following : new ArrayList<>();
    }

    // Getters e Setters
    public List<String> getFollowers() {
        return followers;
    }

    public void setFollowers(List<String> followers) {
        this.followers = followers;
    }

    public List<String> getFollowing() {
        return following;
    }

    public void setFollowing(List<String> following) {
        this.following = following;
    }

    public int getFollowersCount() {
        return followers != null ? followers.size() : 0;
    }

    public int getFollowingCount() {
        return following != null ? following.size() : 0;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserGraph userGraph = (UserGraph) o;
        return Objects.equals(followers, userGraph.followers) &&
                Objects.equals(following, userGraph.following);
    }

    @Override
    public int hashCode() {
        return Objects.hash(followers, following);
    }

    @Override
    public String toString() {
        return "UserGraph{" +
                "followers=" + getFollowersCount() +
                ", following=" + getFollowingCount() +
                '}';
    }
}