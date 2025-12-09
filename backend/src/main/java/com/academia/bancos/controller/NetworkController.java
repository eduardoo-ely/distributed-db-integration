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

        // 1. BUSCA DIRETA
        Optional<UserNode> userOpt = neo4jRepo.findById(id);

        // 2. SEGURANÇA: Se não achar o usuário no Neo4j (ex: acabou de criar),
        if (userOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of("nodes", List.of(), "links", List.of()));
        }

        UserNode centralUser = userOpt.get();

        List<Map<String, Object>> nodes = new ArrayList<>();
        List<Map<String, Object>> links = new ArrayList<>();

        // 3. Adiciona o usuário central (Eu)
        nodes.add(Map.of("id", centralUser.getUserId(), "group", "me"));

        // 4. Adiciona quem eu sigo (Amigos)
        if (centralUser.getFollowing() != null) {
            for (UserNode followed : centralUser.getFollowing()) {
                nodes.add(Map.of("id", followed.getUserId(), "group", "friend"));

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