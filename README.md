````markdown
# 🧩 Polyglot Data Architecture — PostgreSQL + MongoDB + Neo4j

Projeto profissional que implementa uma arquitetura de persistência poliglota, integrando **PostgreSQL**, **MongoDB** e **Neo4j** em uma aplicação Python.  
O objetivo é demonstrar como diferentes modelos de bancos de dados podem trabalhar juntos de forma complementar para resolver problemas reais de armazenamento, consulta e análise de dados.

---

# 🚀 Tecnologias e Ferramentas

### 📌 Bancos de Dados
- **PostgreSQL** — Sistema relacional para dados estruturados.
- **MongoDB** — Banco NoSQL orientado a documentos para dados semi-estruturados.
- **Neo4j** — Banco de grafos para relacionamentos complexos.

### 📌 Backend / Integração
- **Python 3.x**
- **SQLAlchemy** (PostgreSQL)
- **PyMongo** (MongoDB)
- **Neo4j Driver** (Bolt)
- **FastAPI** (API opcional)
- **Docker + Docker Compose**

### 📌 Qualidade e DevOps
- **Pytest**
- **GitHub Actions**
- **Black / Ruff**
- **.env + python-dotenv**

---

# 🧭 Arquitetura do Projeto

A aplicação demonstra um cenário onde cada banco cumpre um papel distinto dentro da mesma solução:

| Banco        | Papel na Arquitetura |
|--------------|-----------------------|
| **PostgreSQL** | Entidades estruturadas, fortes relações, integridade e transações. |
| **MongoDB**     | Dados dinâmicos, altamente flexíveis e documentos complexos. |
| **Neo4j**       | Navegação de relacionamentos, proximidade, recomendações, análise de grafos. |

O backend abstrai essas diferenças e oferece uma interface única para consumo dos dados.

---

# ⚙️ Passo a Passo Completo de Configuração

Este guia explica como configurar todo o ambiente **do zero**, seguindo exatamente o fluxo recomendado para desenvolvimento profissional.

---

## 1️⃣ Instalar o Python

Baixe e instale Python 3.10 ou superior:  
https://www.python.org/downloads/

Verifique:

```bash
python --version
````

---

## 2️⃣ Criar diretório do projeto

```bash
mkdir projeto-polyglot
cd projeto-polyglot
```

---

## 3️⃣ Criar o ambiente virtual (venv)

```bash
python -m venv venv
```

---

## 4️⃣ Ativar ambiente virtual

**Windows**

```bash
venv\Scripts\activate
```

**Linux/MacOS**

```bash
source venv/bin/activate
```

---

## 5️⃣ Instalar biblioteca Neo4j

```bash
pip install neo4j
```

---

## 6️⃣ Iniciar instância do Neo4j

Pode ser via Neo4j Desktop, AuraDB, ou Docker.

### Exemplo via Docker:

```bash
docker run -d \
  --name neo4j \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/senha123 \
  neo4j:latest
```

Acesse:

* Browser: [http://localhost:7474](http://localhost:7474)
* Usuário: `neo4j`
* Senha: `senha123`

---

## 7️⃣ Abrir o projeto no VSCode

```bash
code .
```

---

## 8️⃣ Instalar extensão Python (VSCode)

* Abrir VSCode
* Extensions → Buscar por **Python (Microsoft)**
* Instalar

---

## 9️⃣ Criar arquivo Python e copiar o código de teste

Crie o arquivo:

```
app/main.py
```

Cole:

```python
from neo4j import GraphDatabase

class App:

    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def test_connection(self):
        with self.driver.session() as session:
            result = session.run("RETURN 'Conexão bem sucedida!' AS message")
            print(result.single()["message"])


if __name__ == "__main__":
    app = App("bolt://localhost:7687", "neo4j", "senha123")
    app.test_connection()
    app.close()
```

---

## 🔟 Executar o teste

```bash
python app/main.py
```

Saída esperada:

```
Conexão bem sucedida!
```

---

# 🧠 Consulta à IA (exigência)

Abaixo está a resposta gerada por IA sobre os métodos da classe `driver` na biblioteca Neo4j.

## Métodos principais do driver Neo4j (Python)

### 🔹 `driver.session()`

Cria uma sessão para execução de queries.

```python
with driver.session() as session:
    session.run("MATCH (n) RETURN n LIMIT 5")
```

### 🔹 `driver.close()`

Fecha a conexão.

```python
driver.close()
```

### 🔹 `driver.verify_connectivity()`

Testa a conexão com o servidor.

```python
driver.verify_connectivity()
```

### 🔹 `driver.execute_query()`

Executa consultas sem criar sessão manualmente.

```python
result = driver.execute_query("RETURN 1 AS value")
```

---

## 📚 Como referenciar a IA (exigência)

Resposta da IA:

> **OPENAI. Resposta gerada pela ferramenta ChatGPT sobre métodos do driver Neo4j em Python. Consulta realizada em 17/11/2025.**

---

# 📘 Documentação Completa

Na pasta **/docs** você encontrará:

* Arquitetura da aplicação
* Diagramas de entidades e grafos
* Exemplos de consultas
* Modelo de dados
* Fluxo das integrações

---

# 🏁 Objetivo Geral do Projeto

Implementar uma arquitetura realista de persistência poliglota integrando três bancos de dados com funções complementares, demonstrando:

* Modelagem relacional (PostgreSQL)
* Modelagem documental (MongoDB)
* Modelagem em grafo (Neo4j)
* Integração Python entre os três sistemas
* Organização profissional de projeto e documentação

---

# 📄 Licença

MIT License

---

# 👤 Autores

**Eduardo de Paula**
**Inaye Karolaine**
**Mateus Conte**

```
Quer algum desses?
```
