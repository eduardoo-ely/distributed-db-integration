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
import java.time.Instant;
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
    private static final int USER_LIMIT = 50;           // Carrega apenas 50 usuários do JSON
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

            // Limpa chaves do Redis (Login Count e Sessões)
            try {
                var keysLogin = redisTemplate.keys("login_count:*");
                var keysSession = redisTemplate.keys("session:*");
                var keysLastLogin = redisTemplate.keys("last_login:*");

                if (keysLogin != null && !keysLogin.isEmpty()) redisTemplate.delete(keysLogin);
                if (keysSession != null && !keysSession.isEmpty()) redisTemplate.delete(keysSession);
                if (keysLastLogin != null && !keysLastLogin.isEmpty()) redisTemplate.delete(keysLastLogin);
            } catch (Exception e) { /* ignora erro redis se estiver desligado */ }

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

    public void loadUsers() {
        System.out.println("┌────────────────────────────────────────────────────┐");
        System.out.println("│   📥 IMPORTANDO USUÁRIOS (Limitado a " + USER_LIMIT + ")            │");
        System.out.println("└────────────────────────────────────────────────────┘");

        List<UserEntity> pgBatch = new ArrayList<>();
        List<UserProfileDoc> mongoBatch = new ArrayList<>();
        List<UserNode> neo4jBatch = new ArrayList<>();

        // =================================================================================
        // 🚀 1. CRIAR ADMIN (Manual)
        // =================================================================================
        System.out.println("⚡ Criando usuário ADMIN...");

        // A) Postgres (Auth)
        UserEntity adminPG = new UserEntity();
        adminPG.setUserId(ADMIN_ID);
        adminPG.setEmail(ADMIN_EMAIL);
        adminPG.setPasswordHash("123456");
        pgBatch.add(adminPG);

        // B) MongoDB (Dados Ricos de Perfil)
        UserProfileDoc adminMongo = new UserProfileDoc();
        adminMongo.setUserId(ADMIN_ID);
        adminMongo.setAge(30);
        adminMongo.setCountry("Brazil");
        adminMongo.setGenres(Arrays.asList("Action", "Sci-Fi", "Tech", "Coding")); // Dados para o gráfico do Mongo
        mongoBatch.add(adminMongo);

        // C) Neo4j (Grafo Social)
        UserNode adminNeo = new UserNode();
        adminNeo.setUserId(ADMIN_ID);
        neo4jBatch.add(adminNeo);

        // D) Redis (Sessão e Cache)
        try {
            // Contador de Login (Usado no card do Dashboard)
            redisTemplate.opsForValue().set("login_count:" + ADMIN_ID, "999");
            // Status da Sessão (Simulação)
            redisTemplate.opsForValue().set("session:" + ADMIN_ID, "ACTIVE");
            // Último Login (Timestamp)
            redisTemplate.opsForValue().set("last_login:" + ADMIN_ID, Instant.now().toString());
        } catch (Exception e) { System.err.println("   ⚠️ Redis indisponível para Admin"); }

        // =================================================================================
        // 📦 2. LER JSON E POPULAR O RESTO
        // =================================================================================
        try {
            var resource = new ClassPathResource("netflix_userbase.json");
            if (!resource.exists()) {
                System.err.println("   ⚠️ AVISO: 'netflix_userbase.json' não encontrado. Criando apenas o Admin.");
            } else {
                InputStream inputStream = resource.getInputStream();
                List<Map<String, Object>> usersMap = objectMapper.readValue(inputStream, new TypeReference<>() {});
                int totalToProcess = Math.min(usersMap.size(), USER_LIMIT);
                int successCount = 0;

                for (int i = 0; i < totalToProcess; i++) {
                    Map<String, Object> map = usersMap.get(i);
                    try {
                        UserDTO dto = mapToDto(map);
                        if (dto.getUserId().equals(ADMIN_ID)) continue;

                        // Postgres
                        UserEntity entity = new UserEntity();
                        entity.setUserId(dto.getUserId());
                        entity.setEmail(dto.getEmail() != null ? dto.getEmail() : "user" + i + "@example.com");
                        entity.setPasswordHash(dto.getPassword() != null ? dto.getPassword() : "123456");
                        pgBatch.add(entity);

                        // Mongo
                        UserProfileDoc doc = new UserProfileDoc();
                        doc.setUserId(dto.getUserId());
                        doc.setAge(dto.getAge());
                        doc.setCountry(dto.getCountry());
                        doc.setGenres(dto.getGenres());
                        mongoBatch.add(doc);

                        // Neo4j
                        UserNode node = new UserNode();
                        node.setUserId(dto.getUserId());
                        neo4jBatch.add(node);

                        // Redis
                        String loginCount = dto.getLoginCount() != null ? dto.getLoginCount().toString() : "0";
                        try {
                            redisTemplate.opsForValue().set("login_count:" + dto.getUserId(), loginCount);
                            // Simula que alguns usuários estão "offline"
                            redisTemplate.opsForValue().set("session:" + dto.getUserId(), "OFFLINE");
                        } catch (Exception e) {}

                        successCount++;

                        // Batch Save
                        if (pgBatch.size() >= BATCH_SIZE || i == totalToProcess - 1) {
                            postgresRepo.saveAll(pgBatch);
                            postgresRepo.flush();
                            mongoRepo.saveAll(mongoBatch);
                            neo4jRepo.saveAll(neo4jBatch);
                            pgBatch.clear();
                            mongoBatch.clear();
                            neo4jBatch.clear();
                            System.out.print(".");
                        }
                    } catch (Exception e) {
                        System.err.println("   ❌ Erro linha " + i + ": " + e.getMessage());
                    }
                }
                System.out.println("\n   ✅ Usuários do JSON importados: " + successCount);
            }
        } catch (Exception e) {
            System.err.println("   ❌ Erro ao ler JSON: " + e.getMessage());
        }

        // Salva o Admin (caso o loop do JSON não tenha rodado ou terminado)
        if (!pgBatch.isEmpty()) {
            postgresRepo.saveAll(pgBatch);
            mongoRepo.saveAll(mongoBatch);
            neo4jRepo.saveAll(neo4jBatch);
        }
    }

    public void loadRelationships() {
        System.out.println("\n┌────────────────────────────────────────────────────┐");
        System.out.println("│   🕸️  IMPORTANDO RELACIONAMENTOS (Meta: " + RELATIONSHIP_TARGET + ")        │");
        System.out.println("└────────────────────────────────────────────────────┘");

        // 1. LER DO JSON (Se existir)
        int successCount = 0;
        try {
            var resource = new ClassPathResource("relationships.json");
            if (resource.exists()) {
                InputStream inputStream = resource.getInputStream();
                List<Map<String, String>> relations = objectMapper.readValue(inputStream, new TypeReference<>() {});

                for (Map<String, String> rel : relations) {
                    if (successCount >= RELATIONSHIP_TARGET) break;
                    try {
                        String followerId = rel.get("followerId");
                        String followedId = rel.get("followedId");

                        if (followerId != null && followedId != null) {
                            var f1 = neo4jRepo.findById(followerId);
                            var f2 = neo4jRepo.findById(followedId);

                            if (f1.isPresent() && f2.isPresent()) {
                                UserNode follower = f1.get();
                                follower.follows(f2.get());
                                neo4jRepo.save(follower);
                                successCount++;
                            }
                        }
                    } catch (Exception e) {}
                }
            }
        } catch (Exception e) { System.err.println("   ⚠️ Erro JSON Relacionamentos: " + e.getMessage()); }
        System.out.println("   ✅ Relacionamentos JSON: " + successCount);

        // 2. FORÇAR CONEXÕES PARA O ADMIN (Para o gráfico ficar bonito)
        System.out.println("⚡ Conectando ADMIN...");
        try {
            var adminOpt = neo4jRepo.findById(ADMIN_ID);
            if (adminOpt.isPresent()) {
                UserNode admin = adminOpt.get();
                List<UserNode> randomUsers = neo4jRepo.findAll().stream()
                        .filter(u -> !u.getUserId().equals(ADMIN_ID))
                        .limit(5)
                        .collect(Collectors.toList());

                for (UserNode user : randomUsers) {
                    // Bidirecional para testar o StackOverflow fix
                    admin.follows(user);
                    user.follows(admin);
                    neo4jRepo.save(user);
                }
                neo4jRepo.save(admin);
                System.out.println("   ✅ Admin conectado a " + randomUsers.size() + " usuários.");
            }
        } catch (Exception e) {
            System.err.println("   ❌ Erro relacionamentos Admin: " + e.getMessage());
        }
    }

    private void showDatabaseStats() {
        System.out.println("\n📊 Status Final dos Bancos:");
        System.out.println("   🐘 Postgres (Auth): " + postgresRepo.count() + " usuários");
        System.out.println("   🍃 MongoDB (Perfil): " + mongoRepo.count() + " documentos");
        System.out.println("   🕸️ Neo4j (Grafo):    " + neo4jRepo.count() + " nós");
        try {
            // Mostra chaves do Redis
            System.out.println("   🔥 Redis (Cache):    " + redisTemplate.keys("login_count:*").size() + " chaves de login");
        } catch (Exception e) {
            System.out.println("   🔥 Redis (Cache):    Indisponível");
        }
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