package com.academia.bancos.controller;

import com.academia.bancos.model.entity.UserEntity;
import com.academia.bancos.repository.UserRepositoryPG;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private UserRepositoryPG userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // TRUQUE: Se o email vier nulo, tenta pegar do campo 'username'
        String emailParaUsar = request.email;
        if (emailParaUsar == null) {
            emailParaUsar = request.username;
        }

        // Debug
        System.out.println("---------------------------------------------");
        System.out.println("📥 JSON PROCESSADO:");
        System.out.println("   Email Final: " + emailParaUsar);
        System.out.println("   Senha: " + request.password);
        System.out.println("---------------------------------------------");

        if (emailParaUsar == null || request.password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email/Username e senha são obrigatórios!"));
        }

        // 1. Busca no Postgres
        Optional<UserEntity> userOpt = userRepository.findByEmail(emailParaUsar);

        if (userOpt.isPresent()) {
            UserEntity user = userOpt.get();

            // 2. Verifica senha
            if (user.getPasswordHash().equals(request.password)) {
                Map<String, Object> response = new HashMap<>();
                response.put("token", "token-falso-para-teste-123");
                response.put("userId", user.getUserId());
                response.put("email", user.getEmail());

                System.out.println("✅ Login SUCESSO para: " + user.getUserId());
                return ResponseEntity.ok(response);
            }
        }

        System.out.println("❌ Login FALHOU (senha ou email incorretos)");
        return ResponseEntity.status(401).body(Map.of("message", "Email ou senha inválidos"));
    }

   public static class LoginRequest {
        public String email;
        public String username;
        public String user;
        public String password;

        // Getters e Setters (importante para o Jackson funcionar bem)
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

       public String getUser() { return user; }
       public void setUser(String user) { this.user = user; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}