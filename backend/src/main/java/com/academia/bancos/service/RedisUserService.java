package com.academia.bancos.service;

import com.academia.bancos.config.RedisConfig;
import redis.clients.jedis.Jedis;

/**
 * Service para operações de cache com Redis
 * Gerencia contadores de login
 */

public class RedisUserService {

    private final RedisConfig config;
    private static final String LOGIN_PREFIX = "user:login:";

    public RedisUserService() {
        this.config = RedisConfig.getInstance();
        System.out.println("✅ RedisUserService inicializado");
    }

    public void initUser(String userId) {
        try (Jedis jedis = config.getConnection()) {
            String key = LOGIN_PREFIX + userId;
            jedis.set(key, "0");
        }
    }

    public void incrementLogin(String userId) {
        try (Jedis jedis = config.getConnection()) {
            String key = LOGIN_PREFIX + userId;
            jedis.incr(key);
        }
    }

    public int getLoginCount(String userId) {
        try (Jedis jedis = config.getConnection()) {
            String key = LOGIN_PREFIX + userId;
            String value = jedis.get(key);
            return value != null ? Integer.parseInt(value) : 0;
        }
    }

    public void setLoginCount(String userId, int count) {
        try (Jedis jedis = config.getConnection()) {
            String key = LOGIN_PREFIX + userId;
            jedis.set(key, String.valueOf(count));
        }
    }

    public void deleteUser(String userId) {
        try (Jedis jedis = config.getConnection()) {
            String key = LOGIN_PREFIX + userId;
            jedis.del(key);
        }
    }

    public boolean exists(String userId) {
        try (Jedis jedis = config.getConnection()) {
            String key = LOGIN_PREFIX + userId;
            return jedis.exists(key);
        }
    }

    public void resetLoginCount(String userId) {
        try (Jedis jedis = config.getConnection()) {
            String key = LOGIN_PREFIX + userId;
            jedis.set(key, "0");
        }
    }

    public void deleteAllUsers() {
        try (Jedis jedis = config.getConnection()) {
            jedis.keys(LOGIN_PREFIX + "*").forEach(jedis::del);
        }
    }
}