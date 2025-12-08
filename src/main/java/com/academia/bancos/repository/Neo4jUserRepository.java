package com.academia.bancos.repository;

import com.academia.bancos.config.Neo4jConfig;
import org.neo4j.driver.Driver;
import org.neo4j.driver.Result;
import org.neo4j.driver.Session;
import org.neo4j.driver.Values;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Repositório para relações de grafo no Neo4j
 */

public class Neo4jUserRepository {

    private final Driver driver;

    public Neo4jUserRepository() {
        this.driver = Neo4jConfig.getInstance().getDriver();
        System.out.println("✅ Neo4jUserRepository inicializado");
    }

    public void createUserNode(String userId) {
        String cypher = "MERGE (u:User {userId: $userId})";

        try (Session session = driver.session()) {
            session.run(cypher, Values.parameters("userId", userId));
        }
    }

    public void createFollowRelationship(String followerId, String followedId) {
        String cypher = """
            MATCH (follower:User {userId: $followerId})
            MATCH (followed:User {userId: $followedId})
            MERGE (follower)-[:FOLLOWS]->(followed)
        """;

        try (Session session = driver.session()) {
            session.run(cypher, Values.parameters(
                    "followerId", followerId,
                    "followedId", followedId
            ));
        }
    }

    public void removeFollowRelationship(String followerId, String followedId) {
        String cypher = """
            MATCH (follower:User {userId: $followerId})-[r:FOLLOWS]->(followed:User {userId: $followedId})
            DELETE r
        """;

        try (Session session = driver.session()) {
            session.run(cypher, Values.parameters(
                    "followerId", followerId,
                    "followedId", followedId
            ));
        }
    }

    public List<String> getFollowers(String userId) {
        String cypher = """
            MATCH (follower:User)-[:FOLLOWS]->(user:User {userId: $userId})
            RETURN follower.userId AS followerId
        """;

        List<String> followers = new ArrayList<>();

        try (Session session = driver.session()) {
            Result result = session.run(cypher, Values.parameters("userId", userId));

            while (result.hasNext()) {
                String followerId = result.next().get("followerId").asString();
                followers.add(followerId);
            }
        }

        return followers;
    }

    public List<String> getFollowing(String userId) {
        String cypher = """
            MATCH (user:User {userId: $userId})-[:FOLLOWS]->(followed:User)
            RETURN followed.userId AS followedId
        """;

        List<String> following = new ArrayList<>();

        try (Session session = driver.session()) {
            Result result = session.run(cypher, Values.parameters("userId", userId));

            while (result.hasNext()) {
                String followedId = result.next().get("followedId").asString();
                following.add(followedId);
            }
        }

        return following;
    }

    public int getFollowersCount(String userId) {
        String cypher = """
            MATCH (follower:User)-[:FOLLOWS]->(user:User {userId: $userId})
            RETURN count(follower) AS count
        """;

        try (Session session = driver.session()) {
            Result result = session.run(cypher, Values.parameters("userId", userId));
            return result.single().get("count").asInt();
        }
    }

    public int getFollowingCount(String userId) {
        String cypher = """
            MATCH (user:User {userId: $userId})-[:FOLLOWS]->(followed:User)
            RETURN count(followed) AS count
        """;

        try (Session session = driver.session()) {
            Result result = session.run(cypher, Values.parameters("userId", userId));
            return result.single().get("count").asInt();
        }
    }

    public boolean isFollowing(String followerId, String followedId) {
        String cypher = """
            MATCH (follower:User {userId: $followerId})-[:FOLLOWS]->(followed:User {userId: $followedId})
            RETURN count(*) > 0 AS isFollowing
        """;

        try (Session session = driver.session()) {
            Result result = session.run(cypher, Values.parameters(
                    "followerId", followerId,
                    "followedId", followedId
            ));
            return result.single().get("isFollowing").asBoolean();
        }
    }

    public List<String> getMutualFollowers(String userId) {
        String cypher = """
            MATCH (user:User {userId: $userId})-[:FOLLOWS]->(other:User)-[:FOLLOWS]->(user)
            RETURN other.userId AS mutualId
        """;

        List<String> mutuals = new ArrayList<>();

        try (Session session = driver.session()) {
            Result result = session.run(cypher, Values.parameters("userId", userId));

            while (result.hasNext()) {
                String mutualId = result.next().get("mutualId").asString();
                mutuals.add(mutualId);
            }
        }

        return mutuals;
    }

    public void deleteUserNode(String userId) {
        String cypher = """
            MATCH (u:User {userId: $userId})
            DETACH DELETE u
        """;

        try (Session session = driver.session()) {
            session.run(cypher, Values.parameters("userId", userId));
        }
    }

    public boolean exists(String userId) {
        String cypher = "MATCH (u:User {userId: $userId}) RETURN count(u) > 0 AS exists";

        try (Session session = driver.session()) {
            Result result = session.run(cypher, Values.parameters("userId", userId));
            return result.single().get("exists").asBoolean();
        }
    }

    public void deleteAllNodes() {
        String cypher = "MATCH (n:User) DETACH DELETE n";

        try (Session session = driver.session()) {
            session.run(cypher);
        }
    }
}