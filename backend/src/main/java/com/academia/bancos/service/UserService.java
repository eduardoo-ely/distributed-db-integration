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
import java.util.Collections; // <--- CORREÇÃO: Import necessário adicionado
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired private UserRepositoryPG postgresRepo;
    @Autowired private UserRepositoryMongo mongoRepo;
    @Autowired private UserRepositoryNeo4j neo4jRepo;
    @Autowired private StringRedisTemplate redisTemplate;

    // ==================== CREATE ====================
    @Transactional
    public UserDTO createUser(UserDTO dto) {
        List<String> savedIn = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        // 1. PostgreSQL (Obrigatório)
        try {
            if (dto.getUserId() == null || dto.getUserId().trim().isEmpty()) {
                throw new IllegalArgumentException("userId não pode ser nulo ou vazio");
            }
            UserEntity entity = new UserEntity();
            entity.setUserId(dto.getUserId().trim());
            entity.setEmail(dto.getEmail() != null ? dto.getEmail().trim() : "");
            entity.setPasswordHash(dto.getPassword() != null ? dto.getPassword() : "");

            postgresRepo.save(entity);
            postgresRepo.flush();
            savedIn.add("PostgreSQL");

        } catch (Exception e) {
            errors.add("PostgreSQL: " + e.getMessage());
            System.err.println("❌ Erro no PostgreSQL: " + e.getMessage());
        }

        // 2. MongoDB
        try {
            UserProfileDoc doc = new UserProfileDoc();
            doc.setUserId(dto.getUserId());
            doc.setAge(dto.getAge());
            doc.setCountry(dto.getCountry());
            doc.setGenres(dto.getGenres());
            mongoRepo.save(doc);
            savedIn.add("MongoDB");
        } catch (Exception e) {
            errors.add("MongoDB: " + e.getMessage());
            System.err.println("❌ Erro no MongoDB: " + e.getMessage());
        }

        // 3. Neo4j
        try {
            UserNode node = new UserNode();
            node.setUserId(dto.getUserId());
            neo4jRepo.save(node);
            savedIn.add("Neo4j");
        } catch (Exception e) {
            errors.add("Neo4j: " + e.getMessage());
            System.err.println("❌ Erro no Neo4j: " + e.getMessage());
        }

        // 4. Redis
        try {
            String loginCount = dto.getLoginCount() != null ? dto.getLoginCount().toString() : "0";
            redisTemplate.opsForValue().set("login_count:" + dto.getUserId(), loginCount);
            savedIn.add("Redis");
        } catch (Exception e) {
            errors.add("Redis: " + e.getMessage());
            System.err.println("❌ Erro no Redis: " + e.getMessage());
        }

        dto.setSavedIn(savedIn);
        if (savedIn.isEmpty()) {
            throw new RuntimeException("Falha total ao salvar: " + String.join("; ", errors));
        }
        return dto;
    }

    // ==================== READ ====================
    public Object getAllUsers(String source) {
        try {
            if ("postgres".equalsIgnoreCase(source)) {
                return postgresRepo.findAll().stream().map(entity -> {
                    UserDTO dto = new UserDTO();
                    dto.setUserId(entity.getUserId());
                    dto.setEmail(entity.getEmail());
                    dto.setSavedIn(Collections.singletonList("PostgreSQL"));
                    return dto;
                }).collect(Collectors.toList());

            } else if ("mongo".equalsIgnoreCase(source)) {
                return mongoRepo.findAll().stream().map(doc -> {
                    UserDTO dto = new UserDTO();
                    dto.setUserId(doc.getUserId());
                    dto.setAge(doc.getAge());
                    dto.setCountry(doc.getCountry());
                    dto.setGenres(doc.getGenres());
                    dto.setSavedIn(Collections.singletonList("MongoDB"));
                    return dto;
                }).collect(Collectors.toList());

            } else if ("neo4j".equalsIgnoreCase(source)) {
                return neo4jRepo.findAll().stream().map(node -> {
                    UserDTO dto = new UserDTO();
                    dto.setUserId(node.getUserId());
                    dto.setSavedIn(Collections.singletonList("Neo4j"));
                    // Mapeamento manual para evitar recursividade
                    if (node.getFollowing() != null) {
                        dto.setFollowingIds(node.getFollowing().stream()
                                .map(UserNode::getUserId)
                                .collect(Collectors.toList()));
                    }
                    return dto;
                }).collect(Collectors.toList());

            } else {
                return getAllUsersAggregated();
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erro ao buscar usuários: " + e.getMessage());
        }
    }

    private List<UserDTO> getAllUsersAggregated() {
        List<UserEntity> pgUsers = postgresRepo.findAll();

        return pgUsers.stream().map(entity -> {
            UserDTO dto = new UserDTO();
            dto.setUserId(entity.getUserId());
            dto.setEmail(entity.getEmail());
            List<String> savedIn = new ArrayList<>();
            savedIn.add("PostgreSQL");


            // 1. Busca MongoDB
            try {
                mongoRepo.findById(entity.getUserId()).ifPresent(profile -> {
                    dto.setAge(profile.getAge());
                    dto.setCountry(profile.getCountry());
                    dto.setGenres(profile.getGenres());
                    savedIn.add("MongoDB");
                });
            } catch (Exception e) {
                System.err.println("⚠️ MongoDB indisponível para " + entity.getUserId());
            }

            // 2. Busca Redis
            try {
                String count = redisTemplate.opsForValue().get("login_count:" + entity.getUserId());
                if (count != null) {
                    dto.setLoginCount(Integer.parseInt(count));
                    savedIn.add("Redis");
                }
            } catch (Exception e) {
                System.err.println("⚠️ Redis indisponível para " + entity.getUserId());
            }

            // 3. Busca Neo4j
            try {
                neo4jRepo.findById(entity.getUserId()).ifPresent(node -> {
                    savedIn.add("Neo4j");
                    if (node.getFollowing() != null && !node.getFollowing().isEmpty()) {
                        List<String> followingIds = node.getFollowing().stream()
                                .map(UserNode::getUserId)
                                .collect(Collectors.toList());
                        dto.setFollowingIds(followingIds);
                    }
                });
            } catch (Exception e) {
                System.err.println("⚠️ Neo4j indisponível para " + entity.getUserId());
            }

            dto.setSavedIn(savedIn);
            return dto;
        }).collect(Collectors.toList());
    }

    public UserDTO getUserAggregated(String userId) {
        UserDTO dto = new UserDTO();
        dto.setUserId(userId);
        List<String> savedIn = new ArrayList<>();

        try {
            postgresRepo.findById(userId).ifPresent(u -> {
                dto.setEmail(u.getEmail());
                savedIn.add("PostgreSQL");
            });
        } catch (Exception e) { System.err.println("Erro PG: " + e.getMessage()); }

        try {
            mongoRepo.findById(userId).ifPresent(u -> {
                dto.setAge(u.getAge());
                dto.setCountry(u.getCountry());
                dto.setGenres(u.getGenres());
                savedIn.add("MongoDB");
            });
        } catch (Exception e) { System.err.println("Erro Mongo: " + e.getMessage()); }

        try {
            String count = redisTemplate.opsForValue().get("login_count:" + userId);
            if (count != null) {
                dto.setLoginCount(Integer.parseInt(count));
                savedIn.add("Redis");
            }
        } catch (Exception e) { System.err.println("Erro Redis: " + e.getMessage()); }

        try {
            neo4jRepo.findById(userId).ifPresent(node -> {
                savedIn.add("Neo4j");
                if (node.getFollowing() != null && !node.getFollowing().isEmpty()) {
                    dto.setFollowingIds(node.getFollowing().stream()
                            .map(UserNode::getUserId)
                            .collect(Collectors.toList()));
                }
            });
        } catch (Exception e) { System.err.println("Erro Neo4j: " + e.getMessage()); }

        dto.setSavedIn(savedIn);
        return dto;
    }

    // ==================== UPDATE ====================
    @Transactional
    public UserDTO updateUser(String userId, UserDTO dto) {
        List<String> updatedIn = new ArrayList<>();

        postgresRepo.findById(userId).ifPresent(entity -> {
            if (dto.getEmail() != null) entity.setEmail(dto.getEmail());
            if (dto.getPassword() != null) entity.setPasswordHash(dto.getPassword());
            postgresRepo.save(entity);
            updatedIn.add("PostgreSQL");
        });

        mongoRepo.findById(userId).ifPresent(doc -> {
            if (dto.getAge() != null) doc.setAge(dto.getAge());
            if (dto.getCountry() != null) doc.setCountry(dto.getCountry());
            if (dto.getGenres() != null) doc.setGenres(dto.getGenres());
            mongoRepo.save(doc);
            updatedIn.add("MongoDB");
        });

        if (dto.getLoginCount() != null) {
            redisTemplate.opsForValue().set("login_count:" + userId, dto.getLoginCount().toString());
            updatedIn.add("Redis");
        }

        dto.setSavedIn(updatedIn);
        return dto;
    }

    // ==================== DELETE ====================
    @Transactional
    public void deleteUser(String userId) {
        // Tentamos deletar de todos, logando erros mas não parando tudo se um falhar (opcional)
        // Aqui mantivemos o throw para garantir consistência, mas poderia ser mais leniente
        try {
            postgresRepo.deleteById(userId);
            try { mongoRepo.deleteById(userId); } catch (Exception e) {}
            try { neo4jRepo.deleteById(userId); } catch (Exception e) {}
            try { redisTemplate.delete("login_count:" + userId); } catch (Exception e) {}
        } catch (Exception e) {
            throw new RuntimeException("Erro ao deletar usuário: " + e.getMessage());
        }
    }

    // ==================== RELACIONAMENTOS ====================
    @Transactional
    public void createFollowRelationship(String followerId, String followedId) {
        try {
            Optional<UserNode> followerOpt = neo4jRepo.findById(followerId);
            Optional<UserNode> followedOpt = neo4jRepo.findById(followedId);

            if (followerOpt.isPresent() && followedOpt.isPresent()) {
                UserNode follower = followerOpt.get();
                UserNode followed = followedOpt.get();
                follower.follows(followed);
                neo4jRepo.save(follower);
            }
        } catch (Exception e) {
            System.err.println("Erro ao criar relacionamento Neo4j: " + e.getMessage());
        }
    }

    // ==================== UTILIDADES ====================
    public long countUsers() { return postgresRepo.count(); }

    public void incrementLoginCount(String userId) {
        try {
            redisTemplate.opsForValue().increment("login_count:" + userId);
        } catch (Exception e) {
            System.err.println("Erro Redis Incr: " + e.getMessage());
        }
    }
}