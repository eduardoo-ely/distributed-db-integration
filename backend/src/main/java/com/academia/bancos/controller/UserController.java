package com.academia.bancos.controller;

import com.academia.bancos.model.dto.UserDTO;
import com.academia.bancos.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;

    // ==================== CREATE ====================
    @PostMapping
    public ResponseEntity<UserDTO> create(@RequestBody UserDTO user) {
        try {
            UserDTO created = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ==================== READ ====================
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getById(@PathVariable String id) {
        try {
            UserDTO user = userService.getUserAggregated(id);
            if (user.getEmail() == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Lista todos com filtro opcional por banco
    @GetMapping
    public ResponseEntity<Object> listAll(@RequestParam(required = false) String source) {
        try {
            return ResponseEntity.ok(userService.getAllUsers(source));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ==================== UPDATE ====================
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> update(
            @PathVariable String id,
            @RequestBody UserDTO user) {
        try {
            UserDTO updated = userService.updateUser(id, user);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ==================== DELETE ====================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ==================== RELACIONAMENTOS ====================
    @PostMapping("/{followerId}/follow/{followedId}")
    public ResponseEntity<String> createFollowRelationship(
            @PathVariable String followerId,
            @PathVariable String followedId) {
        try {
            userService.createFollowRelationship(followerId, followedId);
            return ResponseEntity.ok("Relacionamento criado com sucesso");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erro: " + e.getMessage());
        }
    }

    // ==================== UTILIDADES ====================
    @PostMapping("/{id}/login")
    public ResponseEntity<Map<String, Object>> incrementLogin(@PathVariable String id) {
        try {
            userService.incrementLoginCount(id);
            UserDTO user = userService.getUserAggregated(id);
            return ResponseEntity.ok(Map.of(
                    "userId", id,
                    "loginCount", user.getLoginCount()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}