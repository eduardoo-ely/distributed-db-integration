package com.academia.bancos.repository;

import com.academia.bancos.model.node.UserNode;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepositoryNeo4j extends Neo4jRepository<UserNode, String> {

    @Query("MATCH (a:User {userId: $followerId})-[r:FOLLOWS]->(b:User {userId: $followedId}) DELETE r")
    void deleteRelationship(String followerId, String followedId);
}