package com.academia.bancos.config;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

public class PostgresConfig {
    private static PostgresConfig instance;
    private String url;
    private String user;
    private String password;

    private PostgresConfig() {
        loadProperties();
    }

    public static PostgresConfig getInstance() {
        if (instance == null) {
            instance = new PostgresConfig();
        }
        return instance;
    }

    private void loadProperties() {
        try (InputStream input = getClass().getClassLoader()
                .getResourceAsStream("application.properties")) {
            Properties prop = new Properties();
            prop.load(input);

            String host = prop.getProperty("postgres.host");
            String port = prop.getProperty("postgres.port");
            String database = prop.getProperty("postgres.database");
            this.user = prop.getProperty("postgres.user");
            this.password = prop.getProperty("postgres.password");

            this.url = String.format("jdbc:postgresql://%s:%s/%s", host, port, database);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao carregar configurações do PostgreSQL", e);
        }
    }

    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, user, password);
    }

    public void createTableIfNotExists() {
        String sql = """
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                idade INTEGER NOT NULL
            )
        """;

        try (Connection conn = getConnection();
             Statement stmt = conn.createStatement()) {
            stmt.execute(sql);
            System.out.println("✅ Tabela 'usuarios' verificada/criada no PostgreSQL");
        } catch (SQLException e) {
            System.err.println("❌ Erro ao criar tabela no PostgreSQL: " + e.getMessage());
        }
    }

    public void testConnection() {
        try (Connection conn = getConnection()) {
            System.out.println("✅ Conexão com PostgreSQL estabelecida!");
            System.out.println("   URL: " + url);
        } catch (SQLException e) {
            System.err.println("❌ Erro ao conectar ao PostgreSQL: " + e.getMessage());
        }
    }
}