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

    // ==================== CREATE ====================
    @Transactional
    public UserDTO createUser(UserDTO dto) {
        List<String> savedIn = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        // 1. PostgreSQL (Dados Críticos - Credenciais)
        try {
            if (dto.getUserId() == null || dto.getUserId().trim().isEmpty()) {
                throw new IllegalArgumentException("userId não pode ser nulo ou vazio");
            }

            UserEntity entity = new UserEntity();
            entity.setUserId(dto.getUserId().trim());
            entity.setEmail(dto.getEmail() != null ? dto.getEmail().trim() : "");
            entity.setPasswordHash(dto.getPassword() != null ? dto.getPassword() : "");

            postgresRepo.save(entity);
            postgresRepo.flush(); // Força a persistência
            savedIn.add("PostgreSQL");

        } catch (Exception e) {
            errors.add("PostgreSQL: " + e.getMessage());
            System.err.println("❌ Erro ao salvar no PostgreSQL [" + dto.getUserId() + "]: " + e.getMessage());
        }

        // 2. MongoDB (Perfil do Usuário)
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
            System.err.println("❌ Erro ao salvar no MongoDB [" + dto.getUserId() + "]: " + e.getMessage());
        }

        // 3. Neo4j (Grafo Social)
        try {
            UserNode node = new UserNode();
            node.setUserId(dto.getUserId());
            neo4jRepo.save(node);
            savedIn.add("Neo4j");

        } catch (Exception e) {
            errors.add("Neo4j: " + e.getMessage());
            System.err.println("❌ Erro ao salvar no Neo4j [" + dto.getUserId() + "]: " + e.getMessage());
        }

        // 4. Redis (Contadores e Cache)
        try {
            String loginCount = dto.getLoginCount() != null ?
                    dto.getLoginCount().toString() : "0";
            redisTemplate.opsForValue().set("login_count:" + dto.getUserId(), loginCount);
            savedIn.add("Redis");

        } catch (Exception e) {
            errors.add("Redis: " + e.getMessage());
            System.err.println("❌ Erro ao salvar no Redis [" + dto.getUserId() + "]: " + e.getMessage());
        }

        dto.setSavedIn(savedIn);

        // Se nenhum banco salvou, lança exceção
        if (savedIn.isEmpty()) {
            throw new RuntimeException("Falha ao salvar em todos os bancos: " + String.join("; ", errors));
        }

        return dto;
    }

    // ==================== READ ====================
    public Object getAllUsers(String source) {
        if ("postgres".equalsIgnoreCase(source)) {
            return postgresRepo.findAll();
        } else if ("mongo".equalsIgnoreCase(source)) {
            return mongoRepo.findAll();
        } else if ("neo4j".equalsIgnoreCase(source)) {
            return neo4jRepo.findAll();
        } else {
            // Default: Retorna dados agregados de todos os bancos
            return getAllUsersAggregated();
        }
    }

    private List<UserDTO> getAllUsersAggregated() {
        List<UserEntity> pgUsers = postgresRepo.findAll();

        return pgUsers.stream().map(entity -> {
            UserDTO dto = new UserDTO();
            dto.setUserId(entity.getUserId());
            dto.setEmail(entity.getEmail());
            dto.setPassword(entity.getPasswordHash());

            List<String> savedIn = new ArrayList<>();
            savedIn.add("PostgreSQL");

            // Busca dados complementares
            mongoRepo.findById(entity.getUserId()).ifPresent(profile -> {
                dto.setAge(profile.getAge());
                dto.setCountry(profile.getCountry());
                dto.setGenres(profile.getGenres());
                savedIn.add("MongoDB");
            });

            String count = redisTemplate.opsForValue().get("login_count:" + entity.getUserId());
            if (count != null) {
                dto.setLoginCount(Integer.parseInt(count));
                savedIn.add("Redis");
            }

            // Busca relacionamentos
            neo4jRepo.findById(entity.getUserId()).ifPresent(node -> {
                savedIn.add("Neo4j");
                if (node.getFollowing() != null && !node.getFollowing().isEmpty()) {
                    List<String> followingIds = node.getFollowing().stream()
                            .map(UserNode::getUserId)
                            .collect(Collectors.toList());
                    dto.setFollowingIds(followingIds);
                }
            });

            dto.setSavedIn(savedIn);
            return dto;
        }).collect(Collectors.toList());
    }

    public UserDTO getUserAggregated(String userId) {
        UserDTO dto = new UserDTO();
        dto.setUserId(userId);
        List<String> savedIn = new ArrayList<>();

        // Busca PostgreSQL
        postgresRepo.findById(userId).ifPresent(u -> {
            dto.setEmail(u.getEmail());
            dto.setPassword(u.getPasswordHash());
            savedIn.add("PostgreSQL");
        });

        // Busca MongoDB
        mongoRepo.findById(userId).ifPresent(u -> {
            dto.setAge(u.getAge());
            dto.setCountry(u.getCountry());
            dto.setGenres(u.getGenres());
            savedIn.add("MongoDB");
        });

        // Busca Redis
        String count = redisTemplate.opsForValue().get("login_count:" + userId);
        if (count != null) {
            dto.setLoginCount(Integer.parseInt(count));
            savedIn.add("Redis");
        }

        // Busca Neo4j (relacionamentos)
        neo4jRepo.findById(userId).ifPresent(node -> {
            savedIn.add("Neo4j");
            if (node.getFollowing() != null && !node.getFollowing().isEmpty()) {
                List<String> followingIds = node.getFollowing().stream()
                        .map(UserNode::getUserId)
                        .collect(Collectors.toList());
                dto.setFollowingIds(followingIds);
            }
        });

        dto.setSavedIn(savedIn);
        return dto;
    }

    // ==================== UPDATE ====================
    @Transactional
    public UserDTO updateUser(String userId, UserDTO dto) {
        List<String> updatedIn = new ArrayList<>();

        // Atualiza PostgreSQL
        postgresRepo.findById(userId).ifPresent(entity -> {
            if (dto.getEmail() != null) entity.setEmail(dto.getEmail());
            if (dto.getPassword() != null) entity.setPasswordHash(dto.getPassword());
            postgresRepo.save(entity);
            updatedIn.add("PostgreSQL");
        });

        // Atualiza MongoDB
        mongoRepo.findById(userId).ifPresent(doc -> {
            if (dto.getAge() != null) doc.setAge(dto.getAge());
            if (dto.getCountry() != null) doc.setCountry(dto.getCountry());
            if (dto.getGenres() != null) doc.setGenres(dto.getGenres());
            mongoRepo.save(doc);
            updatedIn.add("MongoDB");
        });

        // Atualiza Redis
        if (dto.getLoginCount() != null) {
            redisTemplate.opsForValue().set("login_count:" + userId,
                    dto.getLoginCount().toString());
            updatedIn.add("Redis");
        }

        dto.setSavedIn(updatedIn);
        return dto;
    }

    // ==================== DELETE ====================
    @Transactional
    public void deleteUser(String userId) {
        try {
            // Remove de todos os bancos
            postgresRepo.deleteById(userId);
            mongoRepo.deleteById(userId);
            neo4jRepo.deleteById(userId);
            redisTemplate.delete("login_count:" + userId);
        } catch (Exception e) {
            System.err.println("Erro ao deletar usuário " + userId + ": " + e.getMessage());
            throw e;
        }
    }

    // ==================== RELACIONAMENTOS (Neo4j) ====================
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
            } else {
                String missing = !followerOpt.isPresent() ? followerId : followedId;
                System.err.println("⚠️  Usuário não encontrado no Neo4j: " + missing);
            }
        } catch (Exception e) {
            System.err.println("Erro ao criar relacionamento " + followerId + " -> " + followedId + ": " + e.getMessage());
            // Não lança exceção para não parar o seed
        }
    }

    // ==================== UTILIDADES ====================
    public long countUsers() {
        return postgresRepo.count();
    }

    public long countUsersInPostgres() {
        return postgresRepo.count();
    }

    public long countUsersInMongo() {
        return mongoRepo.count();
    }

    public long countUsersInNeo4j() {
        return neo4jRepo.count();
    }

    public long countUsersInRedis() {
        try {
            var keys = redisTemplate.keys("login_count:*");
            return keys != null ? keys.size() : 0;
        } catch (Exception e) {
            return 0;
        }
    }

    public void incrementLoginCount(String userId) {
        redisTemplate.opsForValue().increment("login_count:" + userId);
    }
}