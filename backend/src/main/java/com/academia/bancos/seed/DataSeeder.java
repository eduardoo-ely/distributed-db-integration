package com.academia.bancos.seed;

import com.academia.bancos.model.*;
import com.academia.bancos.service.UserService;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.List;
import java.util.Map;

/**
 * Componente para popular os bancos de dados.
 * Agora gerenciado pelo Spring Boot.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder {

    private final UserService userService;

    private final Gson gson = new Gson();

    /**
     * Executa o seed completo
     */
    public void seedAll() {
        System.out.println("=".repeat(60));
        System.out.println("🌱 INICIANDO SEED DE DADOS (SPRING BOOT)");
        System.out.println("=".repeat(60));

        // Verificar se arquivos existem na raiz do projeto
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
        // Assume que os arquivos estão na raiz do projeto (onde o Python rodou)
        File usersFile = new File("netflix_userbase.json");
        File relationsFile = new File("relationships.json");

        if (!usersFile.exists()) {
            System.err.println("\n❌ Arquivo não encontrado: netflix_userbase.json");
            System.err.println("📝 Execute o script Python na raiz do projeto primeiro!");
            return false;
        }

        if (!relationsFile.exists()) {
            System.err.println("\n❌ Arquivo não encontrado: relationships.json");
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

        int successCount = 0;
        int errorCount = 0;

        for (int i = 0; i < usersData.size(); i++) {
            try {
                Map<String, Object> userData = usersData.get(i);
                AggregatedUser user = parseUser(userData);

                // Agora funciona porque a variável lá em cima é 'userService'
                userService.createUser(user);

                successCount++;

                if (successCount % 100 == 0) {
                    System.out.println("   ⏳ " + successCount + "/" + usersData.size() + " usuários inseridos...");
                }

            } catch (Exception e) {
                errorCount++;
                // Log de erro simplificado para não poluir
                if (errorCount <= 5) System.err.println("⚠️ Erro (exemplo): " + e.getMessage());
            }
        }

        System.out.println("\n✅ Usuários inseridos: " + successCount);
        if (errorCount > 0) System.out.println("⚠️ Total de erros: " + errorCount);
    }

    /**
     * Cria relacionamentos entre usuários no Neo4j
     */
    private void seedRelationships() throws IOException {
        System.out.println("\n📥 Carregando relacionamentos...");

        Type relationshipListType = new TypeToken<List<Map<String, String>>>(){}.getType();
        List<Map<String, String>> relationships;

        try (FileReader reader = new FileReader("relationships.json")) {
            relationships = gson.fromJson(reader, relationshipListType);
        }

        System.out.println("\n🔄 Criando relacionamentos no Neo4j...");

        int successCount = 0;
        int errorCount = 0;

        for (Map<String, String> rel : relationships) {
            try {
                String followerId = rel.get("followerId");
                String followedId = rel.get("followedId");

                userService.followUser(followerId, followedId);
                successCount++;

                if (successCount % 500 == 0) System.out.println("   ⏳ " + successCount + " relações...");

            } catch (Exception e) {
                errorCount++;
            }
        }

        System.out.println("\n✅ Relacionamentos criados: " + successCount);
    }

    /**
     * Parse Manual (Mantido da sua lógica original pois funciona bem com o Map)
     */
    @SuppressWarnings("unchecked")
    private AggregatedUser parseUser(Map<String, Object> data) {
        AggregatedUser user = new AggregatedUser();

        // Parse credentials (Postgres)
        Map<String, Object> credData = (Map<String, Object>) data.get("credentials");
        if (credData != null) {
            UserCredential cred = new UserCredential();
            cred.setUserId(String.valueOf(credData.get("userId"))); // Garante String
            cred.setEmail((String) credData.get("email"));
            cred.setPasswordHash((String) credData.get("passwordHash"));
            user.setCredentials(cred);
        }

        // Parse profile (Mongo)
        Map<String, Object> profileData = (Map<String, Object>) data.get("profile");
        if (profileData != null) {
            UserProfile profile = new UserProfile();
            profile.setUserId(String.valueOf(profileData.get("userId")));

            // Tratamento robusto para números (JSON pode vir como Double ou Integer)
            Object ageObj = profileData.get("age");
            if (ageObj instanceof Number) profile.setAge(((Number) ageObj).intValue());

            profile.setCountry((String) profileData.get("country"));
            profile.setSubscriptionType((String) profileData.get("subscriptionType"));
            profile.setDevice((String) profileData.get("device"));
            profile.setGender((String) profileData.get("gender"));

            Object revenueObj = profileData.get("monthlyRevenue");
            if (revenueObj instanceof Number) profile.setMonthlyRevenue(((Number) revenueObj).doubleValue());

            profile.setGenres((List<String>) profileData.get("genres"));
            user.setProfile(profile);
        }

        // Parse login count (Redis)
        Object loginCountObj = data.get("loginCount");
        if (loginCountObj instanceof Number) {
            user.setLoginCount(((Number) loginCountObj).intValue());
        }

        return user;
    }
}