# 🎓 Projeto Acadêmico - Backend Multi-Banco

> **Estrutura backend conectando 4 bancos de dados diferentes, cada um com propósito específico**

---

## 🎯 Propósito de Cada Banco

| Banco | Uso                                   | Status |
|-------|---------------------------------------|--------|
| **MongoDB** | Dados de pessoas                      | ✅ Conectado |
| **PostgreSQL** | Dados estruturados                    | ✅ Conectado |
| **Redis** | Cache                                 | ✅ Conectado |
| **Neo4j** | Relacionamentos e grafos (permissões) | ✅ Conectado |

---

## 📁 Estrutura do Projeto

```
bancos-java/
├── src/main/java/com/academia/bancos/
│   ├── Main.java                      # Testa conexões apenas
│   ├── config/                        # Configurações de cada banco
│   │   ├── PostgresConfig.java
│   │   ├── MongoConfig.java
│   │   ├── RedisConfig.java
│   │   └── Neo4jConfig.java
│   ├── service/                       # Serviços (Futuro)
│   │   ├── MongoService.java         # (Futuro)
│   │   ├── PostgresService.java      # (Futuro)
│   │   ├── RedisService.java         # (Futuro)
│   │   └── Neo4jService.java         # (Futuro)
│   └── model/                         # Modelos básicos
│       ├── Pessoa.java                # MongoDB (futuro)
│       └── Credencial.java            # PostgreSQL (futuro)
└── resources/
    └── application.properties
```

---

## ⚙️ Configuração dos Bancos

### **Portas e Credenciais**

| Banco | Porta | Usuário | Senha |
|-------|-------|---------|-------|
| PostgreSQL | 5433 | admin | admin123 |
| MongoDB | 27017 | admin | admin123 |
| Redis | 6380 | - | admin123 |
| Neo4j | 7687 | neo4j | senha123 |

---

## 🚀 Como Executar

### **1. Subir os containers Docker**

```bash
cd ~/projetos/bancos-java
docker-compose up -d
```

### **2. Verificar se estão rodando**

```bash
docker-compose ps
```

### **3. Executar o projeto**

```bash
mvn exec:java -Dexec.mainClass="com.academia.bancos.Main"
```

**OU** no IntelliJ:
- Abra `Main.java`
- Clique no ▶️ verde
- Selecione **Run 'Main.main()'**

---

## ✅ O Que Este Projeto Faz

- ✅ **Testa conexão** com todos os 4 bancos
- ✅ **Configura** cada banco corretamente
- ✅ **Estrutura básica** de serviços (métodos vazios)
- ✅ **Modelos básicos** (sem uso ainda)

## ❌ O Que Este Projeto NÃO Faz

- ❌ **Não insere** dados automaticamente
- ❌ **Não popula** tabelas/coleções
- ❌ **Não executa** operações CRUD automaticamente
- ❌ **Não cria** registros fictícios

---



## 🧪 Testar Manualmente os Bancos

### **PostgreSQL**
```bash
docker exec -it postgres-db psql -U admin -d crud_db
```

### **MongoDB**
```bash
docker exec -it mongodb mongosh -u admin -p admin123 --authenticationDatabase admin
```

### **Redis**
```bash
docker exec -it redis-db redis-cli -a admin123
```

### **Neo4j**
Acesse: http://localhost:7474

---

## 📝 Status Atual

- ✅ Docker Compose configurado
- ✅ Todos os bancos conectados e funcionando
- ✅ Classes de configuração implementadas
- ✅ Estrutura de serviços criada (vazios)
- ✅ Modelos básicos definidos
- ⏳ **Aguardando definição da modelagem de dados**
- ⏳ **Aguardando alimentação manual dos dados**
- ⏳ **Aguardando implementação da lógica de negócio**

---

## 👨‍💻 Desenvolvimento

**Tecnologias:**
- Java 17
- Maven
- Docker & Docker Compose
- IntelliJ IDEA
- WSL2

**Bancos de Dados:**
- PostgreSQL 15
- MongoDB 6.0
- Redis 7
- Neo4j Latest

---

## 📚 Documentação

- [Documentação PostgreSQL](https://www.postgresql.org/docs/)
- [Documentação MongoDB](https://docs.mongodb.com/)
- [Documentação Redis](https://redis.io/documentation)
- [Documentação Neo4j](https://neo4j.com/docs/)

---

**Última atualização:** Novembro 2025