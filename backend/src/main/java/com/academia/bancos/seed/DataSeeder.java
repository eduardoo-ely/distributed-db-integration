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
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private UserRepositoryPG postgresRepo;
    @Autowired private UserRepositoryMongo mongoRepo;
    @Autowired private UserRepositoryNeo4j neo4jRepo;
    @Autowired private StringRedisTemplate redisTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final int BATCH_SIZE = 100; // Processa 100 por vez

    @Override
    public void run(String... args) {
        System.out.println("\n");
        System.out.println("╔══════════════════════════════════════════════════════╗");
        System.out.println("║       🌱 INICIANDO SEED DOS BANCOS DE DADOS 🌱      ║");
        System.out.println("╚══════════════════════════════════════════════════════╝");
        System.out.println();

        try {
            long existingUsers = postgresRepo.count();

            if (existingUsers > 0) {
                System.out.println("⚠️  ATENÇÃO: Já existem " + existingUsers + " usuários cadastrados!");
                System.out.println("⏭️  Pulando seed para evitar duplicação...\n");
                showDatabaseStats();
                return;
            }

            System.out.println("✅ Bancos vazios. Iniciando importação com BATCH PROCESSING...\n");

            loadUsers();
            loadRelationships();

            System.out.println("\n");
            System.out.println("╔══════════════════════════════════════════════════════╗");
            System.out.println("║          ✅ SEED FINALIZADO COM SUCESSO! ✅          ║");
            System.out.println("╚══════════════════════════════════════════════════════╝");
            System.out.println();

            showDatabaseStats();

        } catch (Exception e) {
            System.err.println("\n❌ ERRO CRÍTICO AO EXECUTAR SEED:");
            System.err.println("   " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Transactional
    public void loadUsers() throws Exception {
        System.out.println("┌────────────────────────────────────────────────────┐");
        System.out.println("│  📥 IMPORTANDO USUÁRIOS (netflix_userbase.json)   │");
        System.out.println("└────────────────────────────────────────────────────┘");
        System.out.println();

        InputStream inputStream = new ClassPathResource("netflix_userbase.json").getInputStream();
        List<Map<String, Object>> usersMap = objectMapper.readValue(inputStream, new TypeReference<>() {});

        int total = usersMap.size();
        int successCount = 0;
        int errorCount = 0;
        long startTime = System.currentTimeMillis();

        System.out.println("📊 Total de usuários no JSON: " + total);
        System.out.println("⚡ Processando em lotes de " + BATCH_SIZE + " registros");
        System.out.println();

        // Listas para batch
        List<UserEntity> pgBatch = new ArrayList<>();
        List<UserProfileDoc> mongoBatch = new ArrayList<>();
        List<UserNode> neo4jBatch = new ArrayList<>();

        for (int i = 0; i < usersMap.size(); i++) {
            Map<String, Object> map = usersMap.get(i);

            try {
                UserDTO dto = mapToDto(map);

                // 1. PostgreSQL
                UserEntity entity = new UserEntity();
                entity.setUserId(dto.getUserId());
                entity.setEmail(dto.getEmail() != null ? dto.getEmail() : "");
                entity.setPasswordHash(dto.getPassword() != null ? dto.getPassword() : "");
                pgBatch.add(entity);

                // 2. MongoDB
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

                // 4. Redis (salva individual, é rápido)
                String loginCount = dto.getLoginCount() != null ?
                        dto.getLoginCount().toString() : "0";
                redisTemplate.opsForValue().set("login_count:" + dto.getUserId(), loginCount);

                successCount++;

                // Salva batch quando atingir o tamanho
                if (pgBatch.size() >= BATCH_SIZE || i == usersMap.size() - 1) {
                    try {
                        postgresRepo.saveAll(pgBatch);
                        postgresRepo.flush();
                    } catch (Exception e) {
                        System.err.println("❌ Erro batch PostgreSQL: " + e.getMessage());
                        errorCount += pgBatch.size();
                    }

                    try {
                        mongoRepo.saveAll(mongoBatch);
                    } catch (Exception e) {
                        System.err.println("❌ Erro batch MongoDB: " + e.getMessage());
                    }

                    try {
                        neo4jRepo.saveAll(neo4jBatch);
                    } catch (Exception e) {
                        System.err.println("❌ Erro batch Neo4j: " + e.getMessage());
                    }

                    // Limpa batches
                    pgBatch.clear();
                    mongoBatch.clear();
                    neo4jBatch.clear();
                }

                // Atualiza progresso a cada 50 registros
                if ((i + 1) % 50 == 0 || i == usersMap.size() - 1) {
                    printProgress(i + 1, total, successCount, errorCount, startTime);
                }

            } catch (Exception e) {
                errorCount++;
                if (errorCount <= 3) {
                    System.err.println("\n   ❌ Erro no usuário " + map.get("userId") + ": " + e.getMessage());
                }
            }
        }

        long duration = (System.currentTimeMillis() - startTime) / 1000;
        System.out.println("\n");
        System.out.println("  ✅ Usuários processados: " + successCount + " de " + total);
        if (errorCount > 0) {
            System.out.println("  ⚠️  Erros encontrados: " + errorCount);
        }
        System.out.println("  ⏱️  Tempo decorrido: " + duration + "s");
        System.out.println("  🚀 Velocidade: " + (successCount / Math.max(duration, 1)) + " usuários/s");
        System.out.println();
    }

    @Transactional
    public void loadRelationships() throws Exception {
        System.out.println("┌────────────────────────────────────────────────────┐");
        System.out.println("│  🕸️  IMPORTANDO RELACIONAMENTOS (relationships)   │");
        System.out.println("└────────────────────────────────────────────────────┘");
        System.out.println();

        InputStream inputStream = new ClassPathResource("relationships.json").getInputStream();
        List<Map<String, String>> relations = objectMapper.readValue(inputStream, new TypeReference<>() {});

        int total = relations.size();
        int successCount = 0;
        int errorCount = 0;
        long startTime = System.currentTimeMillis();

        System.out.println("📊 Total de relacionamentos no JSON: " + total);
        System.out.println();

        for (int i = 0; i < relations.size(); i++) {
            Map<String, String> rel = relations.get(i);

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
                    } else {
                        errorCount++;
                    }
                }

                // Atualiza progresso a cada 100 relacionamentos
                if ((i + 1) % 100 == 0 || i == relations.size() - 1) {
                    printProgress(i + 1, total, successCount, errorCount, startTime);
                }

            } catch (Exception e) {
                errorCount++;
                if (errorCount <= 3) {
                    System.err.println("\n   ❌ Erro no relacionamento: " + e.getMessage());
                }
            }
        }

        long duration = (System.currentTimeMillis() - startTime) / 1000;
        System.out.println("\n");
        System.out.println("  ✅ Relacionamentos criados: " + successCount + " de " + total);
        if (errorCount > 0) {
            System.out.println("  ⚠️  Erros/Não encontrados: " + errorCount);
        }
        System.out.println("  ⏱️  Tempo decorrido: " + duration + "s");
        System.out.println();
    }

    private void printProgress(int current, int total, int success, int errors, long startTime) {
        int percentage = (int) ((current * 100.0) / total);
        int barLength = 40;
        int filled = (int) ((current * barLength) / total);

        StringBuilder bar = new StringBuilder("  [");
        for (int i = 0; i < barLength; i++) {
            bar.append(i < filled ? "█" : "░");
        }
        bar.append("]");

        long elapsed = System.currentTimeMillis() - startTime;
        long estimated = current > 0 ? (elapsed * total / current) - elapsed : 0;
        int etaSeconds = (int) (estimated / 1000);

        System.out.print("\r" + bar +
                " " + percentage + "%" +
                " | " + current + "/" + total +
                " | ✓ " + success +
                (errors > 0 ? " | ✗ " + errors : "") +
                " | ETA: " + etaSeconds + "s   ");
    }

    private void showDatabaseStats() {
        System.out.println("┌────────────────────────────────────────────────────┐");
        System.out.println("│           📊 ESTATÍSTICAS DOS BANCOS               │");
        System.out.println("└────────────────────────────────────────────────────┘");
        System.out.println();

        try {
            long pgCount = postgresRepo.count();
            long mongoCount = mongoRepo.count();
            long neo4jCount = neo4jRepo.count();

            var keys = redisTemplate.keys("login_count:*");
            long redisCount = keys != null ? keys.size() : 0;

            System.out.println("  🐘 PostgreSQL:  " + pgCount + " usuários");
            System.out.println("  🍃 MongoDB:     " + mongoCount + " perfis");
            System.out.println("  🔴 Redis:       " + redisCount + " contadores");
            System.out.println("  🕸️  Neo4j:      " + neo4jCount + " nós");

            // Alerta se números não batem
            if (pgCount != mongoCount || pgCount != neo4jCount || pgCount != redisCount) {
                System.out.println();
                System.out.println("  ⚠️  AVISO: Números inconsistentes entre bancos!");
                System.out.println("  💡 Isso pode indicar falhas na inserção.");
            }

            System.out.println();
        } catch (Exception e) {
            System.err.println("  ⚠️  Erro ao buscar estatísticas: " + e.getMessage());
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
            if (genresObj instanceof List) {
                dto.setGenres((List<String>) genresObj);
            }
        }

        Object loginCountObj = map.get("loginCount");
        if (loginCountObj != null) {
            dto.setLoginCount(loginCountObj instanceof Integer ?
                    (Integer) loginCountObj :
                    Integer.parseInt(loginCountObj.toString()));
        }

        return dto;
    }
}