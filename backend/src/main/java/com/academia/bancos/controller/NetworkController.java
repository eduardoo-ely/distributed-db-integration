package com.academia.bancos.controller;

import com.academia.bancos.model.node.UserNode;
import com.academia.bancos.repository.UserRepositoryNeo4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/network")
@CrossOrigin(origins = "http://localhost:4200")
public class NetworkController {

    @Autowired
    private UserRepositoryNeo4j neo4jRepo;

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getNetwork(@PathVariable String id) {
        if ("me".equalsIgnoreCase(id)) {
            id = "admin-master";
        }

        Optional<UserNode> userOpt = neo4jRepo.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        UserNode centralUser = userOpt.get();

        // Estrutura que o gráfico geralmente espera: Nodes (nós) e Links (linhas)
        List<Map<String, Object>> nodes = new ArrayList<>();
        List<Map<String, Object>> links = new ArrayList<>();

        // 1. Adiciona o usuário central (Eu)
        nodes.add(Map.of("id", centralUser.getUserId(), "group", "me"));

        // 2. Adiciona quem eu sigo
        if (centralUser.getFollowing() != null) {
            for (UserNode followed : centralUser.getFollowing()) {
                // Nó do amigo
                nodes.add(Map.of("id", followed.getUserId(), "group", "friend"));

                // Linha conectando Eu -> Amigo
                links.add(Map.of(
                        "source", centralUser.getUserId(),
                        "target", followed.getUserId()
                ));
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("nodes", nodes);
        response.put("links", links);

        return ResponseEntity.ok(response);
    }
}