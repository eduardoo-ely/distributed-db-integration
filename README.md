# 🎓 Sistema Distribuído Fullstack - Integração Multi-Banco

> **Plataforma demonstrativa de persistência poliglota, sincronizando transações entre 4 paradigmas de banco de dados simultaneamente.**

---

## 🏗️ Arquitetura do Projeto

O sistema simula uma rede social (estilo Netflix/Facebook) onde cada aspecto do dado é salvo no banco mais adequado para sua função, mantendo a consistência via código (Backend).

| Camada | Tecnologia | Função |
|--------|------------|--------|
| **Frontend** | Angular 17+ | Dashboard, Gráficos e Gestão de Usuários |
| **Backend** | Java 17 (Spring Boot) | Orquestração, API REST e Regras de Negócio |
| **Infra** | Docker Compose | Containerização dos 4 Bancos |

---

## 🎯 Propósito de Cada Banco (Implementado)

| Banco | Tipo | Uso no Projeto | Status |
|-------|------|----------------|--------|
| **PostgreSQL** | Relacional | **Autenticação:** Email, Hash de Senha e IDs | ✅ CRUD Real |
| **MongoDB** | Documental | **Perfil Rico:** Idade, País, Lista de Gêneros/Filmes | ✅ CRUD Real |
| **Neo4j** | Grafo | **Rede Social:** Nós (Usuários) e Arestas (Seguidores) | ✅ Visualização |
| **Redis** | Chave-Valor | **Sessão & Logs:** Contagem de logins e Cache | ✅ Tempo Real |

---

## 🚀 Funcionalidades Principais

### 1. 🔐 Autenticação & Sessão
- Login valida credenciais no **Postgres**.
- Ao logar, incrementa contador e salva timestamp de "último acesso" no **Redis**.

### 2. 👥 CRUD Distribuído (Atomicidade Lógica)
- **Criar Usuário:** Salva credenciais (PG), cria perfil (Mongo), cria nó (Neo4j) e inicia cache (Redis).
- **Editar:** Permite alterar senha (vai p/ PG), país/filmes (vai p/ Mongo) simultaneamente.
- **Deletar:** Remove o registro de **todos** os 4 bancos para garantir integridade.

### 3. 🕸️ Grafo Social Interativo
- Visualização de bolinhas (Nós) conectadas.
- Botão **"Conectar/Desconectar"** cria ou remove relações `FOLLOWS` no **Neo4j**.

### 4. 📜 Logs e Auditoria
- Histórico de atividades recentes puxadas do sistema e do **Redis**.

---

## ⚙️ Como Executar

### Pré-requisitos
- Docker & Docker Compose
- Java 17+ (JDK)
- Node.js & NPM (para o Angular)

### Passo 1: Subir os Bancos
```bash
docker-compose up -d
````

### Passo 2: Rodar o Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

*Aguarde a mensagem: "SEED FINALIZADO COM SUCESSO"*

### Passo 3: Rodar o Frontend (Angular)

```bash
cd frontend
npm install
npm start
```

*Acesse: http://localhost:4200*

-----

## 🔑 Acesso Administrativo (Seed Automático)

O sistema carrega automaticamente um usuário administrador ao iniciar:

- **Email:** `admin@admin.com`
- **Senha:** `123456`

-----

## 📁 Estrutura de Pastas

```
distributed-db-integration/
├── backend/
│   ├── src/main/java/com/academia/bancos/
│   │   ├── controller/       # Endpoints (User, Auth, Network, Logs)
│   │   ├── service/          # Lógica de distribuição (UserService)
│   │   ├── repository/       # Conexões específicas (PG, Mongo, Neo4j)
│   │   ├── model/            # Entidades (JPA, Document, Node)
│   │   └── seed/             # Carga inicial de dados (DataSeeder)
│   └── src/main/resources/   # Configurações e Arquivos JSON
│
├── frontend/
│   ├── src/app/components/   # Telas (Login, Dashboard)
│   └── src/app/services/     # Comunicação com API
│
└── docker-compose.yml        # Orquestração dos Containers
```

-----

## 🧪 Portas e Acessos Diretos

Caso queira inspecionar os bancos manualmente:

| Serviço | Porta Local | Usuário | Senha | Comando Rápido |
|---------|-------------|---------|-------|----------------|
| **Frontend** | 4200 | - | - | Browser |
| **Backend** | 8080 | - | - | Postman/Browser |
| **Postgres** | 5433 | admin | admin123 | `psql -h localhost -p 5433 -U admin -d crud_db` |
| **MongoDB** | 27017 | admin | admin123 | `mongosh "mongodb://admin:admin123@localhost:27017/crud_db?authSource=admin"` |
| **Neo4j** | 7474 | neo4j | senha123 | Browser: `http://localhost:7474` |
| **Redis** | 6380 | - | admin123 | `redis-cli -p 6380 -a admin123` |

-----

## 👨‍💻 Autor

Desenvolvido como projeto acadêmico para demonstrar integração de sistemas distribuídos e persistência poliglota.
