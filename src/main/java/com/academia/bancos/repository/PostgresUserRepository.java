package com.academia.bancos.repository;

import com.academia.bancos.config.PostgresConfig;
import com.academia.bancos.model.UserCredential;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Repositório para credenciais de usuário no PostgreSQL
 */

public class PostgresUserRepository {

    private final PostgresConfig config;

    public PostgresUserRepository() {
        this.config = PostgresConfig.getInstance();
        initializeTable();
    }

    private void initializeTable() {
        String sql = """
            CREATE TABLE IF NOT EXISTS user_credentials (
                user_id VARCHAR(100) PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """;

        try (Connection conn = config.getConnection();
             Statement stmt = conn.createStatement()) {
            stmt.execute(sql);
            System.out.println("✅ Tabela user_credentials verificada/criada");
        } catch (SQLException e) {
            System.err.println("❌ Erro ao criar tabela: " + e.getMessage());
        }
    }

    public void save(UserCredential credential) {
        String sql = "INSERT INTO user_credentials (user_id, email, password_hash) VALUES (?, ?, ?)";

        try (Connection conn = config.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, credential.getUserId());
            stmt.setString(2, credential.getEmail());
            stmt.setString(3, credential.getPasswordHash());
            stmt.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao salvar credencial: " + e.getMessage(), e);
        }
    }

    public UserCredential findByUserId(String userId) {
        String sql = "SELECT * FROM user_credentials WHERE user_id = ?";

        try (Connection conn = config.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, userId);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapResultSet(rs);
            }
            return null;

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar credencial: " + e.getMessage(), e);
        }
    }

    public UserCredential findByEmail(String email) {
        String sql = "SELECT * FROM user_credentials WHERE email = ?";

        try (Connection conn = config.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, email);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapResultSet(rs);
            }
            return null;

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao buscar por email: " + e.getMessage(), e);
        }
    }

    public List<UserCredential> findAll() {
        String sql = "SELECT * FROM user_credentials";
        List<UserCredential> credentials = new ArrayList<>();

        try (Connection conn = config.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                credentials.add(mapResultSet(rs));
            }
            return credentials;

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao listar credenciais: " + e.getMessage(), e);
        }
    }

    public void update(UserCredential credential) {
        String sql = "UPDATE user_credentials SET email = ?, password_hash = ? WHERE user_id = ?";

        try (Connection conn = config.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, credential.getEmail());
            stmt.setString(2, credential.getPasswordHash());
            stmt.setString(3, credential.getUserId());
            stmt.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao atualizar credencial: " + e.getMessage(), e);
        }
    }

    public void delete(String userId) {
        String sql = "DELETE FROM user_credentials WHERE user_id = ?";

        try (Connection conn = config.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, userId);
            stmt.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao deletar credencial: " + e.getMessage(), e);
        }
    }

    public boolean exists(String userId) {
        String sql = "SELECT 1 FROM user_credentials WHERE user_id = ?";

        try (Connection conn = config.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, userId);
            ResultSet rs = stmt.executeQuery();
            return rs.next();

        } catch (SQLException e) {
            throw new RuntimeException("Erro ao verificar existência: " + e.getMessage(), e);
        }
    }

    private UserCredential mapResultSet(ResultSet rs) throws SQLException {
        UserCredential credential = new UserCredential();
        credential.setUserId(rs.getString("user_id"));
        credential.setEmail(rs.getString("email"));
        credential.setPasswordHash(rs.getString("password_hash"));
        return credential;
    }
}