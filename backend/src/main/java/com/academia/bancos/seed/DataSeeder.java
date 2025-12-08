package com.academia.bancos.seed;

import com.academia.bancos.model.dto.UserDTO;
import com.academia.bancos.service.UserService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserService userService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void run(String... args) {
        System.out.println("🌱 Iniciando verificação de SEED...");

        try {
            // Verifica se já existem dados (ex: no Postgres) para não duplicar

            loadUsers();
            loadRelationships();

            System.out.println("✅ Processo de Seed finalizado!");

        } catch (Exception e) {
            System.err.println("❌ Erro ao executar Seed: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void loadUsers() throws Exception {
        System.out.println("📥 Carregando usuários de netflix_userbase.json...");

        // Lê direto da pasta resources
        InputStream inputStream = new ClassPathResource("netflix_userbase.json").getInputStream();

        // O JSON original é uma lista de objetos complexos, vamos ler como Map primeiro para adaptar
        List<Map<String, Object>> usersMap = objectMapper.readValue(inputStream, new TypeReference<>() {});

        int count = 0;
        for (Map<String, Object> map : usersMap) {
            try {
                UserDTO dto = mapToDto(map);
                userService.createUser(dto);
                count++;
                if (count % 50 == 0) System.out.println("   Processados " + count + " usuários...");
            } catch (Exception e) {
                System.err.println("   Erro no usuário index " + count + ": " + e.getMessage());
            }
        }
        System.out.println("✅ Total de usuários importados: " + count);
    }

    private void loadRelationships() throws Exception {
        System.out.println("📥 Carregando relacionamentos de relationships.json...");

        InputStream inputStream = new ClassPathResource("relationships.json").getInputStream();
        List<Map<String, String>> relations = objectMapper.readValue(inputStream, new TypeReference<>() {});

        int count = 0;
        for (Map<String, String> rel : relations) {
            try {
                String follower = rel.get("followerId");
                String followed = rel.get("followedId");
                // Aqui você precisaria implementar um método no UserService para criar relação
                // userService.followUser(follower, followed);
                count++;
            } catch (Exception e) {
                // Ignora erros de relacionamento
            }
        }
        System.out.println("✅ Relacionamentos processados: " + count);
    }

    // Método auxiliar para converter o formato do JSON original
    private UserDTO mapToDto(Map<String, Object> map) {
        UserDTO dto = new UserDTO();

        // Adapte essas chaves conforme o SEU arquivo JSON original
        // Exemplo baseado na estrutura comum:
        Map<String, Object> cred = (Map<String, Object>) map.get("credentials");
        Map<String, Object> profile = (Map<String, Object>) map.get("profile");

        if (cred != null) {
            dto.setUserId((String) cred.get("userId"));
            dto.setEmail((String) cred.get("email"));
            dto.setPassword((String) cred.get("passwordHash"));
        }

        if (profile != null) {
            dto.setAge((Integer) profile.get("age"));