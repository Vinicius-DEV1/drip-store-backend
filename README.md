# Drip Store — Back-end

API RESTful desenvolvida em Node.js, Express, Sequelize e MySQL para o projeto final de Back-end do curso Geração Tech 4.0.

## Integrantes da equipe

- Vinicius
- Kayuusha

## Tecnologias

- Node.js + Express
- MySQL + Sequelize (ORM e Migrations)
- JWT (`jsonwebtoken`) + `bcrypt`
- `dotenv`, `cors` e `nodemon`
- Swagger (`swagger-ui-express`) e Jest (`jest` + `supertest`)

## Pré-requisitos

- Node.js (v18+)
- Servidor MySQL ativo na máquina (porta padrão `3306`)

## Como configurar e rodar

1. Instale as dependências:
```bash
npm install
```

2. Crie o arquivo `.env` a partir do `.env.example`:
```bash
cp .env.example .env
```
Ajuste `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS` e `DB_NAME` conforme a configuração do seu MySQL (se o seu MySQL exigir senha, preencha `DB_PASS`). O `JWT_SECRET` já vem com uma chave padrão de desenvolvimento no `.env.example`.

3. Crie o banco de dados no MySQL antes de rodar as migrations:
```sql
CREATE DATABASE IF NOT EXISTS drip_store;
```

4. Execute as migrations para criar todas as tabelas:
```bash
npm run migrate
```

5. Inicie o servidor:
```bash
npm run dev
```
O terminal deve exibir `Servidor rodando na porta 3000` e `Conectado ao banco MySQL com sucesso`. Para produção, utilize `npm start`.

## Endpoints principais

- `GET /` — Status da API
- `POST /v1/user` e `POST /v1/user/token` — Cadastro e autenticação JWT
- `GET / PUT / DELETE /v1/user/:id` — Consulta, atualização e remoção de usuário
- `GET /v1/category/search`, `GET /v1/category/:id`, `POST / PUT / DELETE /v1/category` — CRUD e busca de categorias
- `GET /v1/product/search`, `GET /v1/product/:id`, `POST / PUT / DELETE /v1/product` — CRUD e busca de produtos com filtros (`match`, `price-range`, `category_ids`, `option[id]`, `fields`, `limit`, `page`)

## Documentação e testes

- **Swagger:** acesse `http://localhost:3000/api-docs` com o servidor rodando.
- **Testes:** execute `npm test`.
