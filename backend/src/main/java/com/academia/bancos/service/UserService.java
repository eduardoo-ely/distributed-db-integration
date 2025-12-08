package com.academia.bancos.service;

import com.academia.bancos.model.document.UserProfileDoc;
import com.academia.bancos.model.dto.UserDTO;
import com.academia.bancos.model.entity.UserEntity;
import com.academia.bancos.model.node.UserNode;
import com.academia.bancos.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired private UserRepositoryPG postgresRepo;
    @Autowired private UserRepositoryMongo mongoRepo;
    @Autowired private UserRepositoryNeo4j neo4jRepo;
    @Autowired private StringRedisTemplate redisTemplate; // Para contadores simples

    // Criar Usuário em Todos os Bancos
    @Transactional
    public UserDTO createUser(UserDTO dto) {
        List<String> savedIn = new ArrayList<>();

        // 1. PostgreSQL (Dados Críticos)
        UserEntity entity = new UserEntity();
        entity.setUserId(dto.getUserId());
        entity.setEmail(dto.getEmail());
        entity.setPasswordHash(dto.getPassword()); // Em prod, usar encoder
        postgresRepo.save(entity);
        savedIn.add("PostgreSQL");

        // 2. MongoDB (Perfil)
        UserProfileDoc doc = new UserProfileDoc();
        doc.setUserId(dto.getUserId());
        doc.setAge(dto.getAge());
        doc.setCountry(dto.getCountry());
        doc.setGenres(dto.getGenres());
        mongoRepo.save(doc);
        savedIn.add("MongoDB");

        // 3. Neo4j (Grafo)
        UserNode node = new UserNode();
        node.setUserId(dto.getUserId());
        neo4jRepo.save(node);
        savedIn.add("Neo4j");

        // 4. Redis (Inicializar Login Count)
        redisTemplate.opsForValue().set("login_count:" + dto.getUserId(), "0");
        savedIn.add("Redis");

        dto.setSavedIn(savedIn);
        return dto;
    }

    // Buscar filtrando por "source"
    public Object getAllUsers(String source) {
        if ("postgres".equalsIgnoreCase(source)) {
            return postgresRepo.findAll();
        } else if ("mongo".equalsIgnoreCase(source)) {
            return mongoRepo.findAll();
        } else if ("neo4j".equalsIgnoreCase(source)) {
            return neo4jRepo.findAll();
        } else {
            // Default: Retorna lista simples do Postgres
            return postgresRepo.findAll();
        }
    }

    // Método para agregar dados de um usuário específico
    public UserDTO getUserAggregated(String userId) {
        UserDTO dto = new UserDTO();
        dto.setUserId(userId);

        // Busca PG
        postgresRepo.findById(userId).ifPresent(u -> {
            dto.setEmail(u.getEmail());
            dto.setPassword(u.getPasswordHash());
        });

        // Busca Mongo
        mongoRepo.findById(userId).ifPresent(u -> {
            dto.setAge(u.getAge());
            dto.setCountry(u.getCountry());
            dto.setGenres(u.getGenres());
        });

        // Busca Redis
        String count = redisTemplate.opsForValue().get("login_count:" + userId);
        dto.setLoginCount(count != null ? Integer.parseInt(count) : 0);

        return dto;
    }
}