package com.academia.bancos.config;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

import java.io.InputStream;
import java.util.Properties;

public class RedisConfig {
    private static RedisConfig instance;
    private JedisPool jedisPool;

    private RedisConfig() {
        loadProperties();
    }

    public static RedisConfig getInstance() {
        if (instance == null) {
            instance = new RedisConfig();
        }
        return instance;
    }

    private void loadProperties() {
        try (InputStream input = getClass().getClassLoader()
                .getResourceAsStream("application.properties")) {
            Properties prop = new Properties();
            prop.load(input);

            String host = prop.getProperty("redis.host");
            int port = Integer.parseInt(prop.getProperty("redis.port"));
            String password = prop.getProperty("redis.password");

            JedisPoolConfig poolConfig = new JedisPoolConfig();
            poolConfig.setMaxTotal(10);
            poolConfig.setMaxIdle(5);
            poolConfig.setMinIdle(1);

            this.jedisPool = new JedisPool(poolConfig, host, port, 2000, password);
            System.out.println("✅ Pool de conexões Redis criado com sucesso!");
        } catch (Exception e) {
            throw new RuntimeException("Erro ao carregar configurações do Redis", e);
        }
    }

    public Jedis getConnection() {
        return jedisPool.getResource();
    }

    public void testConnection() {
        try (Jedis jedis = getConnection()) {
            String response = jedis.ping();
            System.out.println("✅ Conexão com Redis estabelecida!");
            System.out.println("   PING: " + response);
        } catch (Exception e) {
            System.err.println("❌ Erro ao conectar ao Redis: " + e.getMessage());
        }
    }

    public void close() {
        if (jedisPool != null && !jedisPool.isClosed()) {
            jedisPool.close();
        }
    }
}