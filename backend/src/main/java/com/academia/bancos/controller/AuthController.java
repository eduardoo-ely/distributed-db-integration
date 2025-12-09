package com.academia.bancos.controller;

import com.academia.bancos.model.entity.UserEntity;
import com.academia.bancos.repository.UserRepositoryPG;
import com.academia.bancos.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired private UserRepositoryPG userRepository;
    @Autowired private UserService userService;
    @Autowired private StringRedisTemplate redisTemplate; // <--- Importante para salvar sessão

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String emailParaUsar = request.email != null ? request.email : request.username;

        if (emailParaUsar == null || request.password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Dados incompletos"));
        }

        Optional<UserEntity> userOpt = userRepository.findByEmail(emailParaUsar);

        if (userOpt.isPresent()) {
            UserEntity user = userOpt.get();
            if (user.getPasswordHash().equals(request.password)) {

                String userId = user.getUserId();

                // === 1. REDIS: Incrementar Contador ===
                userService.incrementLoginCount(userId);

                // === 2. REDIS: Salvar Status da Sessão ===
                redisTemplate.opsForValue().set("session:" + userId, "ACTIVE");

                // === 3. REDIS: Salvar Data do Login (Para os Logs) ===
                redisTemplate.opsForValue().set("last_login:" + userId, LocalDateTime.now().toString());

                Map<String, Object> response = new HashMap<>();
                response.put("token", "fake-jwt-" + userId);
                response.put("userId", userId);
                response.put("email", user.getEmail());

                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.status(401).body(Map.of("message", "Credenciais inválidas"));
    }

    public static class LoginRequest {
        public String email;
        public String username;
        public String password;
        // Getters e Setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}