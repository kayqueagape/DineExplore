# DineExplore — Backend API

Backend API para a plataforma DineExplore, construída com Node.js, Express, Sequelize e PostgreSQL.

**Resumo:** esta API oferece autenticação JWT, CRUD de restaurantes, sistema de avaliações, filtros por localização/cuisine/nota e endpoints para usuários e reviews.

**Principais features**
- Autenticação com JWT
- CRUD completo de restaurantes
- Sistema de reviews (avaliações e comentários)
- Filtros por geolocalização, tipo de cozinha e nota mínima
- Arquitetura pronta para rodar com Docker / docker-compose

**Este repositório contém**
- `server.js` / `src/app.js`: ponto de entrada
- `src/models`: modelos Sequelize (`user`, `restaurant`, `review`)
- `src/controllers`: controladores por recurso
- `src/routes`: rotas agrupadas por recurso

## 📋 Requisitos
- Node.js 18+ (recomendado)
- PostgreSQL (local ou em container)
- npm ou yarn
- Docker & Docker Compose (opcional, recomendado para produção/local consistente)

## ⚙️ Variáveis de ambiente
Crie um arquivo `.env` na raiz com pelo menos as variáveis abaixo:

```
DATABASE=postgres://USER:PASS@HOST:PORT/DBNAME
JWT_SECRET=uma_chave_super_secreta
PORT=3000
```

Observações:
- `DATABASE` pode ser uma URL de conexão do Postgres (ex.: `postgres://user:pass@localhost:5432/dineexplore`).
- Ajuste `PORT` se necessário.

## 🧭 Execução local (desenvolvimento)
1. Instale dependências:

```bash
npm install
```

2. Configure o `.env` conforme acima.

3. Inicie o servidor em modo de desenvolvimento:

```bash
npm run dev
```

Ou iniciar diretamente:

```bash
node server.js
```

O servidor por padrão fica em `http://localhost:3000` (ou na porta definida em `PORT`).

## 🐳 Rodando com Docker
O repositório já inclui um `Dockerfile` e `docker-compose.yml`. Abaixo instruções para usar ambos.

1) Build e run com Docker (imagem única):

```bash
docker build -t dineexplore-backend .
docker run -e DATABASE="postgres://user:pass@host:5432/db" -e JWT_SECRET="segredo" -p 3000:3000 dineexplore-backend
```

2) Usando `docker-compose` (recomendado para dev):

```bash
docker-compose up --build
```

Isso deve subir os serviços definidos em `docker-compose.yml` (por exemplo, app + banco Postgres). Verifique os serviços e variáveis no arquivo `docker-compose.yml` antes de rodar.

Dicas:
- Se usar compose com um banco Postgres novo, verifique as variáveis `POSTGRES_USER`, `POSTGRES_PASSWORD` e `POSTGRES_DB` na configuração.
- Pode ser necessário aguardar o banco ficar disponível; a aplicação tentará conectar usando a string em `DATABASE`.

## 📦 Scripts úteis
- `npm run dev` — modo desenvolvimento (com nodemon, se configurado)
- `npm start` — iniciar aplicação (produção)

Verifique `package.json` para scripts exatos.

## 🧩 Endpoints principais
Base: `/api`

- Auth
  - `POST /api/auth/register` — registrar usuário
  - `POST /api/auth/login` — autenticar e receber JWT
  - `GET /api/auth/profile` — perfil do usuário (autenticado)

- Restaurants
  - `GET /api/restaurants` — listar restaurantes
    - Query params opcionais: `latitude`, `longitude`, `radius`, `cuisine`, `minRating`, `search`
  - `GET /api/restaurants/:id` — detalhes
  - `POST /api/restaurants` — criar restaurante (requer autenticação/roles conforme implementação)
  - `PUT /api/restaurants/:id` — atualizar
  - `DELETE /api/restaurants/:id` — remover

- Reviews
  - `POST /api/restaurants/:id/reviews` — criar review para restaurante
  - `GET /api/restaurants/:id/reviews` — listar reviews do restaurante

- Users
  - `GET /api/users/:id` — obter dados do usuário

Consulte os controladores em `src/controllers` para detalhes sobre validação e body esperado.

## 🔍 Estrutura do projeto

```
src/
  app.js
  controllers/
  db/
  middleware/
  models/
  routes/
README.md
server.js
```