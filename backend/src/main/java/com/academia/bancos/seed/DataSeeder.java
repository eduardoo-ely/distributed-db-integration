package com.academia.bancos.seed;

import com.academia.bancos.model.document.UserProfileDoc;
import com.academia.bancos.model.dto.UserDTO;
import com.academia.bancos.model.entity.UserEntity;
import com.academia.bancos.model.node.UserNode;
import com.academia.bancos.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private UserRepositoryPG postgresRepo;
    @Autowired private UserRepositoryMongo mongoRepo;
    @Autowired private UserRepositoryNeo4j neo4jRepo;
    @Autowired private StringRedisTemplate redisTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final int BATCH_SIZE = 50;

    // ================= CONFIGURAÇÕES DE LIMITES =================
    private static final int USER_LIMIT = 50;           // Carrega apenas 50 usuários
    private static final int RELATIONSHIP_TARGET = 300; // Tenta criar até 300 relacionamentos
    // ============================================================

    // === ADMIN CONFIG ===
    private static final String ADMIN_ID = "admin-master";
    private static final String ADMIN_EMAIL = "admin@admin.com";
    // ====================

    @Override
    public void run(String... args) {
        System.out.println("\n");
        System.out.println("╔══════════════════════════════════════════════════════╗");
        System.out.println("║   🌱 SEED OTIMIZADO (+ ADMIN) (Users: " + USER_LIMIT + ")    ║");
        System.out.println("╚══════════════════════════════════════════════════════╝");
        System.out.println();

        try {
            System.out.println("♻️  Limpando bancos antigos...");
            postgresRepo.deleteAll();
            mongoRepo.deleteAll();
            neo4jRepo.deleteAll();
            try {
                var keys = redisTemplate.keys("login_count:*");
                if (keys != null && !keys.isEmpty()) {
                    redisTemplate.delete(keys);
                }
            } catch (Exception e) { /* ignora erro redis */ }

            System.out.println("✅ Bancos limpos. Iniciando carga...\n");

            loadUsers();
            loadRelationships();

            System.out.println("\n");
            System.out.println("╔══════════════════════════════════════════════════════╗");
            System.out.println("║           ✅ SEED FINALIZADO COM SUCESSO! ✅         ║");
            System.out.println("╚══════════════════════════════════════════════════════╝");
            System.out.println();

            showDatabaseStats();

        } catch (Exception e) {
            System.err.println("\n❌ ERRO NO SEED: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void loadUsers() throws Exception {
        System.out.println("┌────────────────────────────────────────────────────┐");
        System.out.println("│   📥 IMPORTANDO USUÁRIOS (Limitado a " + USER_LIMIT + ")          │");
        System.out.println("└────────────────────────────────────────────────────┘");

        InputStream inputStream = new ClassPathResource("netflix_userbase.json").getInputStream();
        List<Map<String, Object>> usersMap = objectMapper.readValue(inputStream, new TypeReference<>() {});

        int totalToProcess = Math.min(usersMap.size(), USER_LIMIT);
        int successCount = 0;

        List<UserEntity> pgBatch = new ArrayList<>();
        List<UserProfileDoc> mongoBatch = new ArrayList<>();
        List<UserNode> neo4jBatch = new ArrayList<>();

        // =================================================================================
        // 🚀 ADICIONANDO ADMIN MANUALMENTE (Pode apagar este bloco depois)
        // =================================================================================
        System.out.println("⚡ Criando usuário ADMIN...");

        // 1. Postgres Admin
        UserEntity adminPG = new UserEntity();
        adminPG.setUserId(ADMIN_ID);
        adminPG.setEmail(ADMIN_EMAIL);
        adminPG.setPasswordHash("123456"); // Senha padrão para testes
        pgBatch.add(adminPG);

        // 2. Mongo Admin
        UserProfileDoc adminMongo = new UserProfileDoc();
        adminMongo.setUserId(ADMIN_ID);
        adminMongo.setAge(30);
        adminMongo.setCountry("Brazil");
        adminMongo.setGenres(Arrays.asList("Action", "Sci-Fi", "Tech"));
        mongoBatch.add(adminMongo);

        // 3. Neo4j Admin
        UserNode adminNeo = new UserNode();
        adminNeo.setUserId(ADMIN_ID);
        neo4jBatch.add(adminNeo);

        // 4. Redis Admin
        redisTemplate.opsForValue().set("login_count:" + ADMIN_ID, "999");
        // =================================================================================

        for (int i = 0; i < totalToProcess; i++) {
            Map<String, Object> map = usersMap.get(i);

            try {
                UserDTO dto = mapToDto(map);

                // Evita criar duplicado se o JSON tiver o mesmo ID (improvável, mas seguro)
                if (dto.getUserId().equals(ADMIN_ID)) continue;

                // 1. Postgres
                UserEntity entity = new UserEntity();
                entity.setUserId(dto.getUserId());
                entity.setEmail(dto.getEmail() != null ? dto.getEmail() : "");
                entity.setPasswordHash(dto.getPassword() != null ? dto.getPassword() : "");
                pgBatch.add(entity);

                // 2. Mongo
                UserProfileDoc doc = new UserProfileDoc();
                doc.setUserId(dto.getUserId());
                doc.setAge(dto.getAge());
                doc.setCountry(dto.getCountry());
                doc.setGenres(dto.getGenres());
                mongoBatch.add(doc);

                // 3. Neo4j
                UserNode node = new UserNode();
                node.setUserId(dto.getUserId());
                neo4jBatch.add(node);

                // 4. Redis
                String loginCount = dto.getLoginCount() != null ? dto.getLoginCount().toString() : "0";
                redisTemplate.opsForValue().set("login_count:" + dto.getUserId(), loginCount);

                successCount++;

                // Salva em batch
                if (pgBatch.size() >= BATCH_SIZE || i == totalToProcess - 1) {
                    postgresRepo.saveAll(pgBatch);
                    postgresRepo.flush();
                    mongoRepo.saveAll(mongoBatch);
                    neo4jRepo.saveAll(neo4jBatch);

                    pgBatch.clear();
                    mongoBatch.clear();
                    neo4jBatch.clear();

                    System.out.print("."); // Indicador visual simples
                }

            } catch (Exception e) {
                System.err.println("   ❌ Erro user " + map.get("userId") + ": " + e.getMessage());
            }
        }
        System.out.println("\n   ✅ Usuários importados: " + successCount + " (+ Admin)");
    }

    public void loadRelationships() throws Exception {
        System.out.println("\n┌────────────────────────────────────────────────────┐");
        System.out.println("│   🕸️  IMPORTANDO RELACIONAMENTOS (Meta: " + RELATIONSHIP_TARGET + ")        │");
        System.out.println("└────────────────────────────────────────────────────┘");

        InputStream inputStream = new ClassPathResource("relationships.json").getInputStream();
        List<Map<String, String>> relations = objectMapper.readValue(inputStream, new TypeReference<>() {});

        int successCount = 0;

        for (Map<String, String> rel : relations) {
            if (successCount >= RELATIONSHIP_TARGET) break;

            try {
                String followerId = rel.get("followerId");
                String followedId = rel.get("followedId");

                if (followerId != null && followedId != null) {
                    var followerOpt = neo4jRepo.findById(followerId);
                    var followedOpt = neo4jRepo.findById(followedId);

                    if (followerOpt.isPresent() && followedOpt.isPresent()) {
                        UserNode follower = followerOpt.get();
                        UserNode followed = followedOpt.get();
                        follower.follows(followed);
                        neo4jRepo.save(follower);
                        successCount++;
                    }
                }
            } catch (Exception e) { /* ignora falhas individuais */ }
        }
        System.out.println("   ✅ Relacionamentos do JSON criados: " + successCount);

        // =================================================================================
        // 🚀 FORÇANDO CONEXÕES DO ADMIN (Para testes de visualização)
        // =================================================================================
        System.out.println("⚡ Conectando ADMIN a usuários aleatórios para testes...");
        var adminOpt = neo4jRepo.findById(ADMIN_ID);

        if (adminOpt.isPresent()) {
            UserNode admin = adminOpt.get();
            // Pega os 5 primeiros usuários que NÃO sejam o admin
            List<UserNode> randomUsers = neo4jRepo.findAll().stream()
                    .filter(u -> !u.getUserId().equals(ADMIN_ID))
                    .limit(5)
                    .collect(Collectors.toList());

            for (UserNode user : randomUsers) {
                // Admin segue o usuário
                admin.follows(user);
                // Usuário segue o Admin (pra ficar legal no grafo)
                user.follows(admin);

                neo4jRepo.save(user); // Salva o user com a nova relação
            }
            neo4jRepo.save(admin); // Salva o admin com as novas relações
            System.out.println("   ✅ Admin conectado a " + randomUsers.size() + " usuários (Bidirecional)");
        } else {
            System.err.println("   ❌ Admin não encontrado no Neo4j para criar relações.");
        }
        // =================================================================================
    }

    private void showDatabaseStats() {
        System.out.println("\n📊 Status Final:");
        System.out.println("Postgres: " + postgresRepo.count());
        System.out.println("Mongo:    " + mongoRepo.count());
        System.out.println("Neo4j:    " + neo4jRepo.count() + " (Nós)");
    }

    private UserDTO mapToDto(Map<String, Object> map) {
        UserDTO dto = new UserDTO();
        dto.setUserId((String) map.get("userId"));

        Map<String, Object> credentials = (Map<String, Object>) map.get("credentials");
        if (credentials != null) {
            dto.setEmail((String) credentials.get("email"));
            dto.setPassword((String) credentials.get("passwordHash"));
        }

        Map<String, Object> profile = (Map<String, Object>) map.get("profile");
        if (profile != null) {
            dto.setAge((Integer) profile.get("age"));
            dto.setCountry((String) profile.get("country"));
            Object genresObj = profile.get("genres");
            if (genresObj instanceof List) dto.setGenres((List<String>) genresObj);
        }

        Object loginCountObj = map.get("loginCount");
        if (loginCountObj != null) {
            dto.setLoginCount(loginCountObj instanceof Integer ? (Integer) loginCountObj : Integer.parseInt(loginCountObj.toString()));
        }
        return dto;
    }
}