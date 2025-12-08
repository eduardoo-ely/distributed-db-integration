package com.academia.bancos.controller;

import com.academia.bancos.model.AggregatedUser;
import com.academia.bancos.service.UserService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller para operações de usuário
 * Endpoints:
 * - POST   /users          - Criar usuário
 * - GET    /users/{id}     - Buscar usuário
 * - PUT    /users/{id}     - Atualizar usuário
 * - DELETE /users/{id}     - Deletar usuário
 * - GET    /users          - Listar todos usuários
 * - POST   /users/{id}/login     - Registrar login
 * - POST   /users/{id}/follow    - Seguir usuário
 * - DELETE /users/{id}/follow    - Deixar de seguir
 */
public class UserController {

    private final UserService userService;
    private final Gson gson;
    private HttpServer server;

    public UserController() {
        this.userService = new UserService();
        this.gson = new GsonBuilder().setPrettyPrinting().create();
    }

    /**
     * Inicia o servidor HTTP na porta 8080
     */
    public void start() throws IOException {
        server = HttpServer.create(new InetSocketAddress(8080), 0);

        // Registrar endpoints
        server.createContext("/users", this::handleUsers);
        server.createContext("/users/", this::handleUserById);

        server.setExecutor(null);
        server.start();

        System.out.println("=".repeat(60));
        System.out.println("🚀 Servidor REST iniciado na porta 8080");
        System.out.println("=".repeat(60));
        System.out.println("📋 Endpoints disponíveis:");
        System.out.println("   POST   http://localhost:8080/users");
        System.out.println("   GET    http://localhost:8080/users");
        System.out.println("   GET    http://localhost:8080/users/{id}");
        System.out.println("   PUT    http://localhost:8080/users/{id}");
        System.out.println("   DELETE http://localhost:8080/users/{id}");
        System.out.println("   POST   http://localhost:8080/users/{id}/login");
        System.out.println("   POST   http://localhost:8080/users/{id}/follow");
        System.out.println("   DELETE http://localhost:8080/users/{id}/unfollow");
        System.out.println("=".repeat(60));
    }

    public void stop() {
        if (server != null) {
            server.stop(0);
            System.out.println("🛑 Servidor REST encerrado");
        }
    }

    private void handleUsers(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();

        try {
            switch (method) {
                case "POST" -> createUser(exchange);
                case "GET" -> listUsers(exchange);
                default -> sendResponse(exchange, 405, createError("Método não permitido"));
            }
        } catch (Exception e) {
            sendResponse(exchange, 500, createError(e.getMessage()));
        }
    }

    private void handleUserById(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();
        String[] parts = path.split("/");

        if (parts.length < 3) {
            sendResponse(exchange, 400, createError("ID do usuário não fornecido"));
            return;
        }

        String userId = parts[2];

        try {
            if (parts.length == 3) {
                // /users/{id}
                switch (method) {
                    case "GET" -> getUser(exchange, userId);
                    case "PUT" -> updateUser(exchange, userId);
                    case "DELETE" -> deleteUser(exchange, userId);
                    default -> sendResponse(exchange, 405, createError("Método não permitido"));
                }
            } else if (parts.length == 4) {
                // /users/{id}/action
                String action = parts[3];
                switch (action) {
                    case "login" -> registerLogin(exchange, userId);
                    case "follow" -> followUser(exchange, userId);
                    case "unfollow" -> unfollowUser(exchange, userId);
                    default -> sendResponse(exchange, 404, createError("Ação não encontrada"));
                }
            }
        } catch (Exception e) {
            sendResponse(exchange, 500, createError(e.getMessage()));
        }
    }

    private void createUser(HttpExchange exchange) throws IOException {
        String body = readRequestBody(exchange);
        AggregatedUser user = gson.fromJson(body, AggregatedUser.class);

        userService.createUser(user);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Usuário criado com sucesso");
        response.put("userId", user.getUserId());

        sendResponse(exchange, 201, response);
    }

    private void getUser(HttpExchange exchange, String userId) throws IOException {
        AggregatedUser user = userService.getUser(userId);
        sendResponse(exchange, 200, user);
    }

    private void listUsers(HttpExchange exchange) throws IOException {
        List<AggregatedUser> users = userService.listAllUsers();

        Map<String, Object> response = new HashMap<>();
        response.put("total", users.size());
        response.put("users", users);

        sendResponse(exchange, 200, response);
    }

    private void updateUser(HttpExchange exchange, String userId) throws IOException {
        String body = readRequestBody(exchange);
        AggregatedUser user = gson.fromJson(body, AggregatedUser.class);

        // Garantir que o userId do path seja usado
        if (user.getCredentials() != null) {
            user.getCredentials().setUserId(userId);
        }
        if (user.getProfile() != null) {
            user.getProfile().setUserId(userId);
        }

        userService.updateUser(user);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Usuário atualizado com sucesso");

        sendResponse(exchange, 200, response);
    }

    private void deleteUser(HttpExchange exchange, String userId) throws IOException {
        userService.deleteUser(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Usuário deletado com sucesso");

        sendResponse(exchange, 200, response);
    }

    private void registerLogin(HttpExchange exchange, String userId) throws IOException {
        userService.registerLogin(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login registrado");
        response.put("loginCount", userService.getUser(userId).getLoginCount());

        sendResponse(exchange, 200, response);
    }

    private void followUser(HttpExchange exchange, String followerId) throws IOException {
        String body = readRequestBody(exchange);
        Map<String, String> data = gson.fromJson(body, Map.class);
        String followedId = data.get("followedId");

        if (followedId == null) {
            sendResponse(exchange, 400, createError("followedId não fornecido"));
            return;
        }

        userService.followUser(followerId, followedId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", followerId + " agora segue " + followedId);

        sendResponse(exchange, 200, response);
    }

    private void unfollowUser(HttpExchange exchange, String followerId) throws IOException {
        String body = readRequestBody(exchange);
        Map<String, String> data = gson.fromJson(body, Map.class);
        String followedId = data.get("followedId");

        if (followedId == null) {
            sendResponse(exchange, 400, createError("followedId não fornecido"));
            return;
        }

        userService.unfollowUser(followerId, followedId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", followerId + " deixou de seguir " + followedId);

        sendResponse(exchange, 200, response);
    }

    private String readRequestBody(HttpExchange exchange) throws IOException {
        InputStream is = exchange.getRequestBody();
        return new String(is.readAllBytes(), StandardCharsets.UTF_8);
    }

    private void sendResponse(HttpExchange exchange, int statusCode, Object data) throws IOException {
        String jsonResponse = gson.toJson(data);
        byte[] bytes = jsonResponse.getBytes(StandardCharsets.UTF_8);

        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(statusCode, bytes.length);

        OutputStream os = exchange.getResponseBody();
        os.write(bytes);
        os.close();
    }

    private Map<String, Object> createError(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("error", message);
        return error;
    }
}