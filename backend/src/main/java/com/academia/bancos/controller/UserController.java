package com.academia.bancos.controller;

import com.academia.bancos.model.dto.UserDTO;
import com.academia.bancos.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200") // Para o Angular
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<UserDTO> create(@RequestBody UserDTO user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getById(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserAggregated(id));
    }

    // Exemplo: /api/users?source=mongo
    @GetMapping
    public ResponseEntity<Object> listAll(@RequestParam(required = false) String source) {
        return ResponseEntity.ok(userService.getAllUsers(source));
    }
}