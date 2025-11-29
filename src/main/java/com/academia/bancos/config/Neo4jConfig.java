package com.academia.bancos.config;

import org.neo4j.driver.AuthTokens;
import org.neo4j.driver.Driver;
import org.neo4j.driver.GraphDatabase;
import org.neo4j.driver.Session;
import org.neo4j.driver.Result;

import java.io.InputStream;
import java.util.Properties;

public class Neo4jConfig {
    private static Neo4jConfig instance;
    private Driver driver;

    private Neo4jConfig() {
        loadProperties();
    }

    public static Neo4jConfig getInstance() {
        if (instance == null) {
            instance = new Neo4jConfig();
        }
        return instance;
    }

    private void loadProperties() {
        try (InputStream input = getClass().getClassLoader()
                .getResourceAsStream("application.properties")) {
            Properties prop = new Properties();
            prop.load(input);

            String uri = prop.getProperty("neo4j.uri");
            String user = prop.getProperty("neo4j.user");
            String password = prop.getProperty("neo4j.password");

            this.driver = GraphDatabase.driver(uri, AuthTokens.basic(user, password));
            System.out.println("✅ Driver Neo4j criado com sucesso!");
        } catch (Exception e) {
            throw new RuntimeException("Erro ao carregar configurações do Neo4j", e);
        }
    }

    public Driver getDriver() {
        return driver;
    }

    public Session getSession() {
        return driver.session();
    }

    public void testConnection() {
        try (Session session = getSession()) {
            Result result = session.run("RETURN 'Conexão OK' AS message");
            String message = result.single().get("message").asString();
            System.out.println("✅ Conexão com Neo4j estabelecida!");
            System.out.println("   Resposta: " + message);
        } catch (Exception e) {
            System.err.println("❌ Erro ao conectar ao Neo4j: " + e.getMessage());
        }
    }

    public void close() {
        if (driver != null) {
            driver.close();
        }
    }
}