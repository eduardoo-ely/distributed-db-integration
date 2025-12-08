package com.academia.bancos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Main {

    public static void main(String[] args) {
        // 1. Inicia o servidor Tomcat na porta 8080
        // 2. Conecta no Postgres, Mongo, Redis e Neo4j automaticamente
        // 3. Cria os Repositórios e Services
        // 4. Coloca sua API no ar
        SpringApplication.run(Main.class, args);

        System.out.println("=".repeat(60));
        System.out.println("🎓 SISTEMA DISTRIBUÍDO - NETFLIX USERBASE");
        System.out.println("🚀 Servidor Online: http://localhost:8080/users");
        System.out.println("=".repeat(60));
    }
}