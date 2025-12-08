package com.academia.bancos.service;

import com.academia.bancos.model.*;
import com.academia.bancos.repository.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Service agregador que coordena operações entre todos os bancos
 * Responsável por manter consistência entre PostgreSQL, MongoDB, Neo4j e Redis
 */
public class UserService {

    private final PostgresUserRepository postgresRepo;
    private final MongoUserRepository mongoRepo;
    private final Neo4jUserRepository neo4jRepo;
    private final RedisUserService redisService;

    public UserService() {
        this.postgresRepo = new PostgresUserRepository();
        this.mongoRepo = new MongoUserRepository();
        this.neo4jRepo = new Neo4jUserRepository();
        this.redisService = new RedisUserService();
        System.out.println("✅ UserService agregador inicializado");
    }

    /**
     * Cria um usuário completo em todos os bancos
     * @param aggregatedUser dados completos do usuário
     */
    public void createUser(AggregatedUser aggregatedUser) {
        String userId = aggregatedUser.getUserId();

        try {
            // 1. Salvar credenciais no PostgreSQL
            if (aggregatedUser.getCredentials() != null) {
                postgresRepo.save(aggregatedUser.getCredentials());
            }

            // 2. Salvar perfil no MongoDB
            if (aggregatedUser.getProfile() != null) {
                mongoRepo.save(aggregatedUser.getProfile());
            }

            // 3. Criar nó no Neo4j
            neo4jRepo.createUserNode(userId);

            // 4. Inicializar contador no Redis
            redisService.initUser(userId);

            System.out.println("✅ Usuário criado: " + userId);

        } catch (Exception e) {
            // Rollback em caso de erro
            rollbackUserCreation(userId);
            throw new RuntimeException("Erro ao criar usuário: " + e.getMessage(), e);
        }
    }

    /**
     * Busca usuário agregando dados de todos os bancos
     * @param userId ID do usuário
     * @return dados completos do usuário
     */
    public AggregatedUser getUser(String userId) {
        AggregatedUser user = new AggregatedUser();

        // 1. Buscar credenciais no PostgreSQL
        UserCredential credentials = postgresRepo.findByUserId(userId);
        if (credentials == null) {
            throw new RuntimeException("Usuário não encontrado: " + userId);
        }
        user.setCredentials(credentials);

        // 2. Buscar perfil no MongoDB
        UserProfile profile = mongoRepo.findByUserId(userId);
        user.setProfile(profile);

        // 3. Buscar relações no Neo4j
        UserGraph relations = new UserGraph();
        relations.setFollowers(neo4jRepo.getFollowers(userId));
        relations.setFollowing(neo4jRepo.getFollowing(userId));
        user.setRelations(relations);

        // 4. Buscar contador de logins no Redis
        int loginCount = redisService.getLoginCount(userId);
        user.setLoginCount(loginCount);

        return user;
    }

    /**
     * Atualiza dados do usuário
     * @param aggregatedUser dados atualizados
     */
    public void updateUser(AggregatedUser aggregatedUser) {
        String userId = aggregatedUser.getUserId();

        // Verificar se usuário existe
        if (!postgresRepo.exists(userId)) {
            throw new RuntimeException("Usuário não encontrado: " + userId);
        }

        // Atualizar credenciais se fornecidas
        if (aggregatedUser.getCredentials() != null) {
            postgresRepo.update(aggregatedUser.getCredentials());
        }

        // Atualizar perfil se fornecido
        if (aggregatedUser.getProfile() != null) {
            mongoRepo.update(aggregatedUser.getProfile());
        }

        System.out.println("✅ Usuário atualizado: " + userId);
    }

    /**
     * Deleta usuário de todos os bancos
     * @param userId ID do usuário a ser deletado
     */
    public void deleteUser(String userId) {
        try {
            // 1. Deletar do PostgreSQL
            postgresRepo.delete(userId);

            // 2. Deletar do MongoDB
            mongoRepo.delete(userId);

            // 3. Deletar do Neo4j (remove nó e relações)
            neo4jRepo.deleteUserNode(userId);

            // 4. Deletar do Redis
            redisService.deleteUser(userId);

            System.out.println("✅ Usuário deletado: " + userId);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao deletar usuário: " + e.getMessage(), e);
        }
    }

    /**
     * Lista todos os usuários (agregado básico sem relações completas)
     * @return lista de usuários agregados
     */
    public List<AggregatedUser> listAllUsers() {
        List<UserCredential> credentials = postgresRepo.findAll();
        List<AggregatedUser> users = new ArrayList<>();

        for (UserCredential cred : credentials) {
            try {
                AggregatedUser user = getUser(cred.getUserId());
                users.add(user);
            } catch (Exception e) {
                System.err.println("⚠️ Erro ao carregar usuário " + cred.getUserId());
            }
        }

        return users;
    }

    /**
     * Cria relação de follow entre usuários
     * @param followerId ID de quem segue
     * @param followedId ID de quem é seguido
     */
    public void followUser(String followerId, String followedId) {
        // Verificar se ambos existem
        if (!postgresRepo.exists(followerId)) {
            throw new RuntimeException("Follower não encontrado: " + followerId);
        }
        if (!postgresRepo.exists(followedId)) {
            throw new RuntimeException("Followed não encontrado: " + followedId);
        }

        neo4jRepo.createFollowRelationship(followerId, followedId);
        System.out.println("✅ " + followerId + " agora segue " + followedId);
    }

    /**
     * Remove relação de follow
     * @param followerId ID de quem segue
     * @param followedId ID de quem é seguido
     */
    public void unfollowUser(String followerId, String followedId) {
        neo4jRepo.removeFollowRelationship(followerId, followedId);
        System.out.println("✅ " + followerId + " deixou de seguir " + followedId);
    }

    /**
     * Registra um login do usuário
     * @param userId ID do usuário
     */
    public void registerLogin(String userId) {
        redisService.incrementLogin(userId);
        System.out.println("✅ Login registrado para: " + userId);
    }

    /**
     * Verifica se usuário existe
     * @param userId ID do usuário
     * @return true se existe
     */

    public boolean userExists(String userId) {
        return postgresRepo.exists(userId);
    }

    /**
     * Rollback em caso de erro na criação
     */
    private void rollbackUserCreation(String userId) {
        try {
            postgresRepo.delete(userId);
            mongoRepo.delete(userId);
            neo4jRepo.deleteUserNode(userId);
            redisService.deleteUser(userId);
            System.out.println("⚠️ Rollback executado para: " + userId);
        } catch (Exception e) {
            System.err.println("❌ Erro no rollback: " + e.getMessage());
        }
    }
}