package com.academia.bancos.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RedisUserService {

    private final StringRedisTemplate redisTemplate;

    public void initCounter(String userId) {
        redisTemplate.opsForValue().set("login_count:" + userId, "0");
    }

    public Integer incrementLogin(String userId) {
        Long val = redisTemplate.opsForValue().increment("login_count:" + userId);
        return val != null ? val.intValue() : 0;
    }

    public Integer getLoginCount(String userId) {
        String val = redisTemplate.opsForValue().get("login_count:" + userId);
        return val != null ? Integer.parseInt(val) : 0;
    }

    public void deleteUser(String userId) {
        redisTemplate.delete("login_count:" + userId);
    }
}