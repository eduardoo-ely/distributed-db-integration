package com.academia.bancos.controller;

import com.academia.bancos.model.dto.UserDTO;
import com.academia.bancos.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map; // <--- Importante estar aqui

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;

    // --- CREATE ---
    @PostMapping
    public ResponseEntity<UserDTO> create(@RequestBody UserDTO user) {
        try {
            UserDTO created = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // --- READ ALL ---
    @GetMapping
    public ResponseEntity<List<UserDTO>> listAll(@RequestParam(required = false) String source) {
        try {
            return ResponseEntity.ok(userService.getAllUsers(source));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // --- READ POR ID ---
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getById(@PathVariable String id) {
        try {
            UserDTO user = userService.getUserAggregated(id);
            if (user == null || user.getUserId() == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // --- UPDATE ---
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> update(@PathVariable String id, @RequestBody UserDTO user) {
        try {
            UserDTO updated = userService.updateUser(id, user);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // --- DELETE ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // -- Retornar JSON --
    @PostMapping("/{followerId}/follow/{followedId}")
    public ResponseEntity<Map<String, String>> follow(@PathVariable String followerId, @PathVariable String followedId) {
        try {
            userService.createFollowRelationship(followerId, followedId);
            return ResponseEntity.ok(Map.of("message", "Conexão criada com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{followerId}/follow/{followedId}")
    public ResponseEntity<Map<String, String>> unfollow(@PathVariable String followerId, @PathVariable String followedId) {
        try {
            userService.removeFollowRelationship(followerId, followedId);
            return ResponseEntity.ok(Map.of("message", "Conexão removida com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}