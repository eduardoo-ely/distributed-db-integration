package com.academia.bancos;

import com.academia.bancos.config.*;
import com.academia.bancos.controller.UserController;
import com.academia.bancos.seed.DataSeeder;

import java.util.Scanner;

/**
 * Classe principal da aplicação
 * Menu interativo para testar funcionalidades
 */

public class Main {

    private static UserController controller;

    public static void main(String[] args) {
        printHeader();
        testConnections();

        Scanner scanner = new Scanner(System.in);
        boolean running = true;

        while (running) {
            printMenu();
            System.out.print("\n➤ Escolha uma opção: ");

            try {
                int opcao = scanner.nextInt();
                scanner.nextLine(); // Limpar buffer

                running = handleOption(opcao, scanner);

            } catch (Exception e) {
                System.err.println("\n❌ Erro: " + e.getMessage());
                scanner.nextLine(); // Limpar buffer em caso de erro
            }
        }

        cleanup();
        scanner.close();
        System.out.println("\n✅ Aplicação encerrada!");
    }

    private static void printHeader() {
        System.out.println("=".repeat(60));
        System.out.println("🎓 SISTEMA DISTRIBUÍDO - NETFLIX USERBASE");
        System.out.println("   PostgreSQL + MongoDB + Redis + Neo4j");
        System.out.println("=".repeat(60));
        System.out.println();
    }

    private static void testConnections() {
        System.out.println("📡 Testando conexões com os bancos de dados...\n");

        PostgresConfig.getInstance().testConnection();
        MongoConfig.getInstance().testConnection();
        RedisConfig.getInstance().testConnection();
        Neo4jConfig.getInstance().testConnection();

        System.out.println("=".repeat(60));
        System.out.println("✅ Todas as conexões estabelecidas!");
        System.out.println("=".repeat(60));
    }

    private static void printMenu() {
        System.out.println("=".repeat(60));
        System.out.println("📋 MENU PRINCIPAL");
        System.out.println("=".repeat(60));
        System.out.println("1. 🌱 Executar SEED (popular bancos com dataset)");
        System.out.println("2. 🚀 Iniciar servidor REST (porta 8080)");
        System.out.println("3. 🛑 Parar servidor REST");
        System.out.println("4. 📊 Ver estatísticas dos bancos");
        System.out.println("5. 🧹 Limpar todos os dados");
        System.out.println("0. ❌ Sair");
        System.out.println("=".repeat(60));
    }

    private static boolean handleOption(int opcao, Scanner scanner) {
        switch (opcao) {
            case 1 -> executeSeed();
            case 2 -> startRestServer();
            case 3 -> stopRestServer();
            case 4 -> showStatistics();
            case 5 -> clearAllData(scanner);
            case 0 -> {
                System.out.println("\n👋 Encerrando aplicação...");
                return false;
            }
            default -> System.out.println("\n❌ Opção inválida!");
        }

        return true;
    }

    private static void executeSeed() {
        System.out.println("=".repeat(60));
        System.out.println("🌱 EXECUTANDO SEED");
        System.out.println("=".repeat(60));
        System.out.println("⚠️ Certifique-se de que os arquivos JSON existem:");
        System.out.println("   - netflix_userbase.json");
        System.out.println("   - relationships.json");
        System.out.println("\n🔄 Iniciando seed...\n");

        try {
            DataSeeder seeder = new DataSeeder();
            seeder.seedAll();
        } catch (Exception e) {
            System.err.println("\n❌ Erro durante seed: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static void startRestServer() {
        try {
            if (controller != null) {
                System.out.println("\n⚠️ Servidor já está rodando!");
                return;
            }

            controller = new UserController();
            controller.start();

            System.out.println("\n💡 Use Ctrl+C ou opção 3 para parar o servidor");

        } catch (Exception e) {
            System.err.println("\n❌ Erro ao iniciar servidor: " + e.getMessage());
        }
    }

    private static void stopRestServer() {
        if (controller == null) {
            System.out.println("\n⚠️ Servidor não está rodando!");
            return;
        }

        controller.stop();
        controller = null;
        System.out.println("\n✅ Servidor REST encerrado!");
    }

    private static void showStatistics() {
        System.out.println("=".repeat(60));
        System.out.println("📊 ESTATÍSTICAS DOS BANCOS");
        System.out.println("=".repeat(60));


        try {
            // Implementar contagens de cada banco
            System.out.println("\n🐘 PostgreSQL:");
            System.out.println("   Credenciais: [implementar contagem]");

            System.out.println("\n🍃 MongoDB:");
            System.out.println("   Perfis: [implementar contagem]");

            System.out.println("\n🔴 Redis:");
            System.out.println("   Contadores: [implementar contagem]");

            System.out.println("\n🔵 Neo4j:");
            System.out.println("   Nós: [implementar contagem]");
            System.out.println("   Relacionamentos: [implementar contagem]");

        } catch (Exception e) {
            System.err.println("\n❌ Erro ao buscar estatísticas: " + e.getMessage());
        }
    }

    private static void clearAllData(Scanner scanner) {
        System.out.println("=".repeat(60));
        System.out.println("⚠️ ATENÇÃO: LIMPEZA DE DADOS");
        System.out.println("=".repeat(60));
        System.out.println("Esta ação irá DELETAR TODOS OS DADOS de todos os bancos!");
        System.out.print("\nTem certeza? (sim/não): ");

        String confirmacao = scanner.nextLine().trim().toLowerCase();

        if (confirmacao.equals("sim")) {
            System.out.println("\n🧹 Limpando dados...");

            try {
                DataSeeder seeder = new DataSeeder();
                seeder.clearAll();
                System.out.println("✅ Todos os dados foram removidos!");
            } catch (Exception e) {
                System.err.println("❌ Erro ao limpar dados: " + e.getMessage());
            }
        } else {
            System.out.println("\n✅ Operação cancelada!");
        }
    }

    private static void cleanup() {
        if (controller != null) {
            controller.stop();
        }

        MongoConfig.getInstance().close();
        RedisConfig.getInstance().close();
        Neo4jConfig.getInstance().close();
    }
}