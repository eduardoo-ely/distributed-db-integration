package com.academia.bancos.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "http://localhost:4200")
public class LogController {

    @GetMapping("/{id}")
    public ResponseEntity<List<Map<String, String>>> getLogs(@PathVariable String id) {
        String userId = "me".equalsIgnoreCase(id) ? "admin-master" : id;

        List<Map<String, String>> logs = Arrays.asList(
                Map.of("timestamp", LocalDateTime.now().toString(), "action", "Login realizado com sucesso", "user", userId),
                Map.of("timestamp", LocalDateTime.now().minusMinutes(5).toString(), "action", "Visualizou dashboard", "user", userId),
                Map.of("timestamp", LocalDateTime.now().minusMinutes(10).toString(), "action", "Atualizou perfil", "user", userId),
                Map.of("timestamp", LocalDateTime.now().minusHours(1).toString(), "action", "Sincronização de dados", "system", "SYSTEM")
        );

        return ResponseEntity.ok(logs);
    }
}