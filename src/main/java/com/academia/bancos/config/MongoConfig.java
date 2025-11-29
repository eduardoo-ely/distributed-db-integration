package com.academia.bancos.config;

import com.mongodb.MongoClientSettings;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

import java.io.InputStream;
import java.util.Collections;
import java.util.Properties;

public class MongoConfig {
    private static MongoConfig instance;
    private MongoClient mongoClient;
    private String databaseName;

    private MongoConfig() {
        loadProperties();
    }

    public static MongoConfig getInstance() {
        if (instance == null) {
            instance = new MongoConfig();
        }
        return instance;
    }

    private void loadProperties() {
        try (InputStream input = getClass().getClassLoader()
                .getResourceAsStream("application.properties")) {
            Properties prop = new Properties();
            prop.load(input);

            String host = prop.getProperty("mongo.host");
            int port = Integer.parseInt(prop.getProperty("mongo.port"));
            this.databaseName = prop.getProperty("mongo.database");
            String user = prop.getProperty("mongo.user");
            String password = prop.getProperty("mongo.password");

            MongoCredential credential = MongoCredential.createCredential(
                    user, "admin", password.toCharArray()
            );

            MongoClientSettings settings = MongoClientSettings.builder()
                    .applyToClusterSettings(builder ->
                            builder.hosts(Collections.singletonList(
                                    new ServerAddress(host, port)))
                    )
                    .credential(credential)
                    .build();

            this.mongoClient = MongoClients.create(settings);
            System.out.println("✅ Cliente MongoDB criado com sucesso!");
        } catch (Exception e) {
            throw new RuntimeException("Erro ao carregar configurações do MongoDB", e);
        }
    }

    public MongoClient getClient() {
        return mongoClient;
    }

    public MongoDatabase getDatabase() {
        return mongoClient.getDatabase(databaseName);
    }

    public void testConnection() {
        try {
            mongoClient.listDatabaseNames().first();
            System.out.println("✅ Conexão com MongoDB estabelecida!");
            System.out.println("   Database: " + databaseName);
        } catch (Exception e) {
            System.err.println("❌ Erro ao conectar ao MongoDB: " + e.getMessage());
        }
    }

    public void close() {
        if (mongoClient != null) {
            mongoClient.close();
        }
    }
}