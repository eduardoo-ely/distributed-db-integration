# 🚀 Sistema Multi-Banco - Frontend

Frontend moderno e profissional para gerenciamento integrado de múltiplos bancos de dados.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)

## 📋 Sobre o Projeto

Sistema completo em React + TypeScript para gerenciar 4 bancos de dados diferentes de forma integrada:

- 🐘 **PostgreSQL** (porta 5433) - Dados estruturados de usuários
- 🍃 **MongoDB** (porta 27017) - Documentos e dados flexíveis
- ⚡ **Redis** (porta 6380) - Cache e sessões
- 🔵 **Neo4j** (porta 7687/7474) - Relacionamentos e grafos de permissões

## ✨ Funcionalidades

### ✅ Implementado

- ✅ Dashboard principal com métricas de todos os bancos
- ✅ Sistema de rotas com React Router
- ✅ Layout responsivo (mobile-first)
- ✅ Dark/Light mode
- ✅ Gerenciamento de estado com Zustand
- ✅ Integração com TanStack Query (React Query)
- ✅ Sistema de notificações (toast)
- ✅ Error boundaries
- ✅ Loading states
- ✅ Navegação com sidebar

### 🚧 Em Desenvolvimento

- 🚧 Interface CRUD completa para PostgreSQL (Usuários)
- 🚧 Gerenciador de documentos MongoDB
- 🚧 Visualizador de cache Redis
- 🚧 Visualizador de grafos Neo4j

## 🛠️ Tecnologias Utilizadas

### Core
- **React 18.3** - Biblioteca UI
- **TypeScript 5.5** - Tipagem estática
- **Vite 5.4** - Build tool

### Estado & Dados
- **TanStack Query 5.x** - Gerenciamento de estado servidor
- **Zustand 4.x** - Gerenciamento de estado global
- **Axios 1.x** - Cliente HTTP

### UI & Estilização
- **Tailwind CSS 3.x** - Framework CSS utility-first
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones

### Formulários & Validação
- **React Hook Form 7.x** - Gerenciamento de formulários
- **Zod 3.x** - Validação de schemas

### Roteamento
- **React Router DOM 6.x** - Navegação SPA

### Visualização de Dados
- **Recharts 2.x** - Gráficos e charts
- **ReactFlow 11.x** - Visualização de grafos (Neo4j)
- **D3.js 7.x** - Visualizações customizadas

### Utilitários
- **date-fns 3.x** - Manipulação de datas
- **clsx** + **tailwind-merge** - Manipulação de classes CSS

## 🎨 Paleta de Cores

```css
/* Cores dos Bancos de Dados */
--postgres: #006414  /* Verde escuro */
--mongodb: #009929   /* Verde médio */
--redis: #EBED17     /* Amarelo */
--neo4j: #5CCB5F     /* Verde claro */

/* Background */
--background: #FFFFFF /* Branco (modo claro) */
```

## 📁 Estrutura do Projeto

```
frontend-bancos/
├── public/
│   └── assets/
│       └── logo.svg              # Logo do projeto
├── src/
│   ├── api/                       # Configuração de APIs
│   │   ├── axios.config.ts       # Config Axios
│   │   ├── endpoints.ts          # Endpoints
│   │   └── services/             # Serviços por banco
│   │
│   ├── components/                # Componentes reutilizáveis
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── layout/               # Header, Sidebar, Footer
│   │   ├── forms/                # Formulários
│   │   ├── tables/               # Tabelas
│   │   └── common/               # Componentes comuns
│   │
│   ├── features/                  # Features por contexto
│   │   ├── dashboard/            # Dashboard principal
│   │   ├── usuarios/             # PostgreSQL - Usuários
│   │   ├── mongodb/              # MongoDB
│   │   ├── redis/                # Redis
│   │   └── neo4j/                # Neo4j
│   │
│   ├── hooks/                     # Custom hooks globais
│   ├── store/                     # Zustand stores
│   ├── types/                     # TypeScript types
│   ├── utils/                     # Funções utilitárias
│   ├── routes/                    # Configuração de rotas
│   ├── styles/                    # Estilos globais
│   ├── App.tsx                    # Componente raiz
│   └── main.tsx                   # Entry point
```

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# 1. Clone o repositório (ou navegue até a pasta)
cd frontend-bancos

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com as URLs corretas do backend

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em: `http://localhost:3000`

### Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build de produção
npm run lint         # Executa ESLint
```

## 🔧 Configuração de Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_POSTGRES_API_URL=http://localhost:8080/api/usuarios
VITE_MONGO_API_URL=http://localhost:8080/api/documentos
VITE_REDIS_API_URL=http://localhost:8080/api/cache
VITE_NEO4J_API_URL=http://localhost:8080/api/graph
```

## 📡 Integração com Backend

O frontend está configurado para se conectar com o backend Java na porta **8080**.

### Endpoints Esperados

```typescript
// PostgreSQL - Usuarios
GET    /api/usuarios
GET    /api/usuarios/:id
POST   /api/usuarios
PUT    /api/usuarios/:id
DELETE /api/usuarios/:id

// MongoDB
GET    /api/mongodb/collections
GET    /api/mongodb/collections/:collection/documents
POST   /api/mongodb/collections/:collection/documents
DELETE /api/mongodb/collections/:collection/documents/:id

// Redis
GET    /api/redis/keys
GET    /api/redis/keys/:key
POST   /api/redis/keys
DELETE /api/redis/keys/:key
GET    /api/redis/stats

// Neo4j
GET    /api/neo4j/nodes
GET    /api/neo4j/relationships
GET    /api/neo4j/graph
POST   /api/neo4j/query
```

## 🎯 Próximos Passos

1. **Implementar CRUD Completo de Usuários (PostgreSQL)**
   - Tabela com paginação
   - Formulário de criação/edição
   - Validação com Zod
   - Filtros e busca

2. **Interface MongoDB**
   - Lista de coleções
   - Visualizador de documentos
   - Editor JSON
   - Query builder

3. **Interface Redis**
   - Lista de keys com TTL
   - Visualizador de valores
   - Estatísticas de cache
   - Gráfico de memória

4. **Interface Neo4j**
   - Visualizador de grafo interativo
   - Lista de nós e relacionamentos
   - Editor de queries Cypher
   - Matriz de permissões

## 🤝 Contribuindo

Este é um projeto acadêmico. Sugestões e melhorias são bem-vindas!

## 📄 Licença

Projeto acadêmico - Livre para uso educacional

## 👨‍💻 Desenvolvido com

- ❤️ React + TypeScript
- 🎨 Tailwind CSS
- ⚡ Vite
- 🐘🍃⚡🔵 PostgreSQL, MongoDB, Redis, Neo4j

---

**Status**: ✅ Estrutura Base Completa | 🚧 Features em Desenvolvimento
