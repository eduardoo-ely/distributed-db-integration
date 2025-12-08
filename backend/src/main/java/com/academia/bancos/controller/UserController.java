package com.academia.bancos.controller;

import com.academia.bancos.model.AggregatedUser;
import com.academia.bancos.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*") // Resolve o problema do Angular automaticamente!
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<AggregatedUser>> listarTodos() {
        return ResponseEntity.ok(userService.listAllUsers());
    }

    @PostMapping
    public ResponseEntity<AggregatedUser> criar(@RequestBody AggregatedUser user) {
        userService.createUser(user);
        return ResponseEntity.status(201).body(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AggregatedUser> buscar(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUser(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable String id) {
        userService.deleteUser(id); // Adicione este método no Service se não tiver
        return ResponseEntity.noContent().build();
    }

    // Endpoint específico para ação de seguir (Neo4j)
    @PostMapping("/{id}/follow")
    public ResponseEntity<?> seguir(@PathVariable String id, @RequestBody Map<String, String> body) {
        userService.followUser(id, body.get("followedId")); // Adicione no Service
        return ResponseEntity.ok().build();
    }
}