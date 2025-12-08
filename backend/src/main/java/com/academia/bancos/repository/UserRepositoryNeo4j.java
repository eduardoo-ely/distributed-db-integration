package com.academia.bancos.repository;

import com.academia.bancos.model.node.UserNode;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepositoryNeo4j extends Neo4jRepository<UserNode, String> {}