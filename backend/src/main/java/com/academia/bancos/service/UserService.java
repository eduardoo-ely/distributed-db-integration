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
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired private UserRepositoryPG postgresRepo;
    @Autowired private UserRepositoryMongo mongoRepo;
    @Autowired private UserRepositoryNeo4j neo4jRepo;
    @Autowired private StringRedisTemplate redisTemplate;

    // --- CREATE ---
    @Transactional
    public UserDTO createUser(UserDTO dto) {
        // 1. Postgres
        UserEntity entity = new UserEntity();
        entity.setUserId(dto.getUserId());
        entity.setEmail(dto.getEmail());
        entity.setPasswordHash(dto.getPassword());
        postgresRepo.save(entity);

        // 2. Mongo
        UserProfileDoc doc = new UserProfileDoc();
        doc.setUserId(dto.getUserId());
        doc.setAge(dto.getAge() != null ? dto.getAge() : 18);
        doc.setCountry(dto.getCountry() != null ? dto.getCountry() : "Brazil");
        doc.setGenres(dto.getGenres() != null ? dto.getGenres() : new ArrayList<>());
        mongoRepo.save(doc);

        // 3. Neo4j
        UserNode node = new UserNode();
        node.setUserId(dto.getUserId());
        neo4jRepo.save(node);

        // 4. Redis
        redisTemplate.opsForValue().set("login_count:" + dto.getUserId(), "0");

        return dto;
    }

    // --- READ AGGREGATED (IMPORTANTE PARA OS CARDS) ---
    public UserDTO getUserAggregated(String userId) {
        UserDTO dto = new UserDTO();
        dto.setUserId(userId);

        // Inicializa a lista para não dar erro
        List<String> savedIn = new ArrayList<>();

        // A. Postgres
        Optional<UserEntity> pgUser = postgresRepo.findById(userId);
        if (pgUser.isPresent()) {
            dto.setEmail(pgUser.get().getEmail());
            savedIn.add("Postgres");
        }

        // B. Mongo (Dados ricos)
        Optional<UserProfileDoc> mongoUser = mongoRepo.findById(userId);
        if (mongoUser.isPresent()) {
            UserProfileDoc p = mongoUser.get();
            dto.setAge(p.getAge());
            dto.setCountry(p.getCountry());
            dto.setGenres(p.getGenres());
            savedIn.add("MongoDB");
        }

        // C. Redis (Logins)
        String count = redisTemplate.opsForValue().get("login_count:" + userId);
        if (count != null) {
            dto.setLoginCount(Integer.parseInt(count));
            savedIn.add("Redis");
        } else {
            dto.setLoginCount(0);
            redisTemplate.opsForValue().set("login_count:" + userId, "0");
            savedIn.add("Redis");
        }

        dto.setSavedIn(savedIn);
        return dto;
    }

    // --- READ ALL ---
    public List<UserDTO> getAllUsers(String source) {
        return mongoRepo.findAll().stream().map(doc -> {
            UserDTO dto = new UserDTO();
            dto.setUserId(doc.getUserId());
            dto.setAge(doc.getAge());
            dto.setCountry(doc.getCountry());
            dto.setGenres(doc.getGenres());

            // Busca dados complementares
            postgresRepo.findById(doc.getUserId()).ifPresent(pg -> dto.setEmail(pg.getEmail()));
            String count = redisTemplate.opsForValue().get("login_count:" + doc.getUserId());
            dto.setLoginCount(count != null ? Integer.parseInt(count) : 0);

            return dto;
        }).collect(Collectors.toList());
    }

    // --- UPDATE ---
    public UserDTO updateUser(String id, UserDTO dto) {
        postgresRepo.findById(id).ifPresent(u -> {
            if (dto.getEmail() != null && !dto.getEmail().isEmpty()) u.setEmail(dto.getEmail());
            if (dto.getPassword() != null && !dto.getPassword().isEmpty()) u.setPasswordHash(dto.getPassword());
            postgresRepo.save(u);
        });

        mongoRepo.findById(id).ifPresent(d -> {
            if (dto.getAge() != null) d.setAge(dto.getAge());
            if (dto.getCountry() != null) d.setCountry(dto.getCountry());
            if (dto.getGenres() != null) d.setGenres(dto.getGenres());
            mongoRepo.save(d);
        });

        return getUserAggregated(id);
    }

    // --- DELETE ---
    @Transactional
    public void deleteUser(String userId) {
        if (postgresRepo.existsById(userId)) postgresRepo.deleteById(userId);
        if (mongoRepo.existsById(userId)) mongoRepo.deleteById(userId);
        if (neo4jRepo.existsById(userId)) neo4jRepo.deleteById(userId);
        redisTemplate.delete("login_count:" + userId);
        redisTemplate.delete("session:" + userId);
        redisTemplate.delete("last_login:" + userId);
    }

    // --- RELATIONSHIPS ---
    public void createFollowRelationship(String followerId, String followedId) {
        Optional<UserNode> f1 = neo4jRepo.findById(followerId);
        Optional<UserNode> f2 = neo4jRepo.findById(followedId);
        if(f1.isPresent() && f2.isPresent()) {
            UserNode follower = f1.get();
            follower.follows(f2.get());
            neo4jRepo.save(follower);
        }
    }

    public void removeFollowRelationship(String followerId, String followedId) {
        neo4jRepo.deleteRelationship(followerId, followedId);
    }

    public void incrementLoginCount(String userId) {
        redisTemplate.opsForValue().increment("login_count:" + userId);
    }
}