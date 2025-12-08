package com.academia.bancos.seed;

import com.academia.bancos.model.*;
import com.academia.bancos.service.UserService;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.List;
import java.util.Map;

/**
 * Classe para popular os bancos de dados com dados do dataset
 * Lê os arquivos JSON gerados pelo script Python
 */

public class DataSeeder {

    private final UserService userService;
    private final Gson gson;

    public DataSeeder() {
        this.userService = new UserService();
        this.gson = new Gson();
    }

    /**
     * Executa o seed completo
     */
    public void seedAll() {
        System.out.println("=".repeat(60));
        System.out.println("🌱 INICIANDO SEED DE DADOS");
        System.out.println("=".repeat(60));

        // Verificar se arquivos existem
        if (!checkFiles()) {
            return;
        }

        try {
            seedUsers();
            seedRelationships();

            System.out.println("\n" + "=".repeat(60));
            System.out.println("✅ SEED CONCLUÍDO COM SUCESSO!");
            System.out.println("=".repeat(60));

        } catch (Exception e) {
            System.err.println("\n❌ Erro durante seed: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Verifica se os arquivos JSON existem
     */
    private boolean checkFiles() {
        File usersFile = new File("netflix_userbase.json");
        File relationsFile = new File("relationships.json");

        if (!usersFile.exists()) {
            System.err.println("\n❌ Arquivo não encontrado: netflix_userbase.json");
            System.err.println("📝 Execute o script Python primeiro:");
            System.err.println("   python3 download_netflix_dataset.py");
            return false;
        }

        if (!relationsFile.exists()) {
            System.err.println("\n❌ Arquivo não encontrado: relationships.json");
            System.err.println("📝 Execute o script Python primeiro:");
            System.err.println("   python3 download_netflix_dataset.py");
            return false;
        }

        System.out.println("✅ Arquivos JSON encontrados!");
        return true;
    }

    /**
     * Popula usuários nos bancos
     */
    private void seedUsers() throws IOException {
        System.out.println("\n📥 Carregando usuários do arquivo JSON...");

        Type userListType = new TypeToken<List<Map<String, Object>>>(){}.getType();
        List<Map<String, Object>> usersData;

        try (FileReader reader = new FileReader("netflix_userbase.json")) {
            usersData = gson.fromJson(reader, userListType);
        }

        System.out.println("✅ " + usersData.size() + " usuários carregados");
        System.out.println("\n🔄 Inserindo usuários nos bancos de dados...");
        System.out.println("   (Isso pode levar alguns minutos...)");

        int successCount = 0;
        int errorCount = 0;

        for (int i = 0; i < usersData.size(); i++) {
            try {
                Map<String, Object> userData = usersData.get(i);
                AggregatedUser user = parseUser(userData);
                userService.createUser(user);
                successCount++;

                // Mostrar progresso a cada 100 usuários
                if (successCount % 100 == 0) {
                    System.out.println("   ⏳ " + successCount + "/" + usersData.size() + " usuários inseridos...");
                }

            } catch (Exception e) {
                errorCount++;
                System.err.println("⚠️ Erro ao inserir usuário " + i + ": " + e.getMessage());
            }
        }

        System.out.println("\n✅ Usuários inseridos: " + successCount);
        if (errorCount > 0) {
            System.out.println("⚠️ Erros: " + errorCount);
        }
    }

    /**
     * Cria relacionamentos entre usuários no Neo4j
     */
    private void seedRelationships() throws IOException {
        System.out.println("\n📥 Carregando relacionamentos do arquivo JSON...");

        Type relationshipListType = new TypeToken<List<Map<String, String>>>(){}.getType();
        List<Map<String, String>> relationships;

        try (FileReader reader = new FileReader("relationships.json")) {
            relationships = gson.fromJson(reader, relationshipListType);
        }

        System.out.println("✅ " + relationships.size() + " relacionamentos carregados");
        System.out.println("\n🔄 Criando relacionamentos no Neo4j...");
        System.out.println("   (Isso pode levar alguns minutos...)");

        int successCount = 0;
        int errorCount = 0;

        for (int i = 0; i < relationships.size(); i++) {
            try {
                Map<String, String> rel = relationships.get(i);
                String followerId = rel.get("followerId");
                String followedId = rel.get("followedId");

                userService.followUser(followerId, followedId);
                successCount++;

                // Mostrar progresso a cada 500 relacionamentos
                if (successCount % 500 == 0) {
                    System.out.println("   ⏳ " + successCount + "/" + relationships.size() + " relacionamentos criados...");
                }

            } catch (Exception e) {
                errorCount++;
                // Não mostrar erro para cada relacionamento para não poluir o console
                if (errorCount % 100 == 0) {
                    System.err.println("⚠️ " + errorCount + " erros até agora...");
                }
            }
        }

        System.out.println("\n✅ Relacionamentos criados: " + successCount);
        if (errorCount > 0) {
            System.out.println("⚠️ Erros: " + errorCount);
        }
    }

    /**
     * Converte Map para AggregatedUser
     */
    @SuppressWarnings("unchecked")
    private AggregatedUser parseUser(Map<String, Object> data) {
        AggregatedUser user = new AggregatedUser();

        // Parse credentials
        Map<String, Object> credData = (Map<String, Object>) data.get("credentials");
        if (credData != null) {
            UserCredential cred = new UserCredential();
            cred.setUserId((String) credData.get("userId"));
            cred.setEmail((String) credData.get("email"));
            cred.setPasswordHash((String) credData.get("passwordHash"));
            user.setCredentials(cred);
        }

        // Parse profile
        Map<String, Object> profileData = (Map<String, Object>) data.get("profile");
        if (profileData != null) {
            UserProfile profile = new UserProfile();
            profile.setUserId((String) profileData.get("userId"));

            // Age pode vir como Double ou Integer
            Object ageObj = profileData.get("age");
            if (ageObj != null) {
                if (ageObj instanceof Double) {
                    profile.setAge(((Double) ageObj).intValue());
                } else if (ageObj instanceof Integer) {
                    profile.setAge((Integer) ageObj);
                }
            }

            profile.setCountry((String) profileData.get("country"));
            profile.setSubscriptionType((String) profileData.get("subscriptionType"));
            profile.setDevice((String) profileData.get("device"));
            profile.setGender((String) profileData.get("gender"));

            // Monthly revenue
            Object revenueObj = profileData.get("monthlyRevenue");
            if (revenueObj != null) {
                if (revenueObj instanceof Double) {
                    profile.setMonthlyRevenue((Double) revenueObj);
                } else if (revenueObj instanceof Integer) {
                    profile.setMonthlyRevenue(((Integer) revenueObj).doubleValue());
                }
            }

            // Genres
            List<String> genres = (List<String>) profileData.get("genres");
            profile.setGenres(genres);

            user.setProfile(profile);
        }

        // Parse login count
        Object loginCountObj = data.get("loginCount");
        if (loginCountObj != null) {
            if (loginCountObj instanceof Double) {
                user.setLoginCount(((Double) loginCountObj).intValue());
            } else if (loginCountObj instanceof Integer) {
                user.setLoginCount((Integer) loginCountObj);
            }
        }

        return user;
    }

    /**
     * Limpa todos os dados dos bancos
     */
    public void clearAll() {
        System.out.println("\n⚠️ LIMPANDO TODOS OS DADOS...");
        System.out.println("   (Esta operação não pode ser desfeita!)");

        try {
            // Aqui você implementaria métodos para limpar cada banco
            System.out.println("🧹 Limpeza não implementada ainda.");
            System.out.println("💡 Use o menu de cada banco para limpar manualmente:");
            System.out.println("   - PostgreSQL: TRUNCATE TABLE user_credentials;");
            System.out.println("   - MongoDB: db.user_profiles.deleteMany({})");
            System.out.println("   - Redis: FLUSHDB");
            System.out.println("   - Neo4j: MATCH (n) DETACH DELETE n");

        } catch (Exception e) {
            System.err.println("❌ Erro ao limpar dados: " + e.getMessage());
        }
    }

    /**
     * Main para executar seed independentemente
     */
    public static void main(String[] args) {
        System.out.println("🚀 Executando DataSeeder standalone...\n");

        DataSeeder seeder = new DataSeeder();

        // Verificar se deve limpar antes
        if (args.length > 0 && args[0].equals("--clear")) {
            seeder.clearAll();
            return;
        }

        seeder.seedAll();
    }
}