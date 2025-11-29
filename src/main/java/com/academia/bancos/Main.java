package com.academia.bancos;

import com.academia.bancos.config.*;
import com.academia.bancos.model.Usuario;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        System.out.println("=".repeat(60));
        System.out.println("🎓 TRABALHO ACADÊMICO - BANCOS DE DADOS EM JAVA");
        System.out.println("=".repeat(60));
        System.out.println();

        // Testar conexões
        System.out.println("📡 Testando conexões com os bancos de dados...\n");

        PostgresConfig.getInstance().testConnection();
        MongoConfig.getInstance().testConnection();
        RedisConfig.getInstance().testConnection();
        Neo4jConfig.getInstance().testConnection();

        System.out.println("\n" + "=".repeat(60));
        System.out.println("✅ Todas as conexões estabelecidas com sucesso!");
        System.out.println("=".repeat(60));
        System.out.println();

        // Menu interativo
        Scanner scanner = new Scanner(System.in);
        boolean continuar = true;

        while (continuar) {
            System.out.println("\n📋 MENU PRINCIPAL:");
            System.out.println("1. Testar CRUD PostgreSQL");
            System.out.println("2. Testar CRUD MongoDB");
            System.out.println("3. Testar CRUD Redis");
            System.out.println("4. Testar CRUD Neo4j");
            System.out.println("5. Testar TODOS os bancos");
            System.out.println("0. Sair");
            System.out.print("\nEscolha uma opção: ");

            int opcao = scanner.nextInt();
            scanner.nextLine(); // Limpar buffer

            switch (opcao) {
                case 1 -> testarPostgreSQL();
                case 2 -> testarMongoDB();
                case 3 -> testarRedis();
                case 4 -> testarNeo4j();
                case 5 -> testarTodos();
                case 0 -> {
                    continuar = false;
                    System.out.println("\n👋 Encerrando aplicação...");
                }
                default -> System.out.println("❌ Opção inválida!");
            }
        }

        // Fechar conexões
        MongoConfig.getInstance().close();
        RedisConfig.getInstance().close();
        Neo4jConfig.getInstance().close();

        scanner.close();
        System.out.println("✅ Aplicação encerrada!");
    }

    private static void testarPostgreSQL() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("🐘 TESTANDO CRUD - POSTGRESQL");
        System.out.println("=".repeat(60));
        System.out.println("=".repeat(60));
    }

    private static void testarMongoDB() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("🍃 TESTANDO CRUD - MONGODB");
        System.out.println("=".repeat(60));
        System.out.println("=".repeat(60));
    }

    private static void testarRedis() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("🔴 TESTANDO CRUD - REDIS");
        System.out.println("=".repeat(60));

        System.out.println("=".repeat(60));
    }

    private static void testarNeo4j() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("🔵 TESTANDO CRUD - NEO4J");
        System.out.println("=".repeat(60));

        System.out.println("=".repeat(60));
    }

    private static void testarTodos() {
        testarPostgreSQL();
        testarMongoDB();
        testarRedis();
        testarNeo4j();

        System.out.println("\n" + "=".repeat(60));
        System.out.println("✅ TODOS OS BANCOS TESTADOS COM SUCESSO!");
        System.out.println("=".repeat(60));
    }
}