const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Drip Store API',
    version: '1.0.0',
    description: 'API RESTful do projeto final de Back-end (Geração Tech 4.0)',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/v1/user/token': {
      post: {
        tags: ['Usuários'],
        summary: 'Gerar token JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Token gerado com sucesso' },
          400: { description: 'Credenciais inválidas' },
        },
      },
    },
    '/v1/user': {
      post: {
        tags: ['Usuários'],
        summary: 'Cadastrar usuário',
        responses: {
          201: { description: 'Usuário criado' },
          400: { description: 'Dados inválidos' },
        },
      },
    },
    '/v1/user/{id}': {
      get: {
        tags: ['Usuários'],
        summary: 'Buscar usuário por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Usuário encontrado' },
          404: { description: 'Usuário não encontrado' },
        },
      },
      put: {
        tags: ['Usuários'],
        summary: 'Atualizar usuário',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          204: { description: 'Atualizado sem conteúdo' },
          401: { description: 'Não autorizado' },
          404: { description: 'Não encontrado' },
        },
      },
      delete: {
        tags: ['Usuários'],
        summary: 'Remover usuário',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          204: { description: 'Removido sem conteúdo' },
          401: { description: 'Não autorizado' },
          404: { description: 'Não encontrado' },
        },
      },
    },
    '/v1/category/search': {
      get: {
        tags: ['Categorias'],
        summary: 'Listar categorias',
        responses: {
          200: { description: 'Lista paginada de categorias' },
        },
      },
    },
    '/v1/category/{id}': {
      get: {
        tags: ['Categorias'],
        summary: 'Buscar categoria por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Categoria encontrada' },
          404: { description: 'Não encontrada' },
        },
      },
      put: {
        tags: ['Categorias'],
        summary: 'Atualizar categoria',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          204: { description: 'Atualizada sem conteúdo' },
          400: { description: 'Dados inválidos' },
          401: { description: 'Não autorizado' },
          404: { description: 'Não encontrada' },
        },
      },
      delete: {
        tags: ['Categorias'],
        summary: 'Remover categoria',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          204: { description: 'Removida sem conteúdo' },
          401: { description: 'Não autorizado' },
          404: { description: 'Não encontrada' },
        },
      },
    },
    '/v1/category': {
      post: {
        tags: ['Categorias'],
        summary: 'Criar categoria',
        security: [{ bearerAuth: [] }],
        responses: {
          201: { description: 'Categoria criada' },
          401: { description: 'Não autorizado' },
        },
      },
    },
    '/v1/product/search': {
      get: {
        tags: ['Produtos'],
        summary: 'Listar produtos com filtros',
        responses: {
          200: { description: 'Lista paginada de produtos' },
        },
      },
    },
    '/v1/product/{id}': {
      get: {
        tags: ['Produtos'],
        summary: 'Buscar produto por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Produto encontrado' },
          404: { description: 'Não encontrado' },
        },
      },
      put: {
        tags: ['Produtos'],
        summary: 'Atualizar produto',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          204: { description: 'Atualizado sem conteúdo' },
          400: { description: 'Dados inválidos' },
          401: { description: 'Não autorizado' },
          404: { description: 'Não encontrado' },
        },
      },
      delete: {
        tags: ['Produtos'],
        summary: 'Remover produto',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          204: { description: 'Removido sem conteúdo' },
          401: { description: 'Não autorizado' },
          404: { description: 'Não encontrado' },
        },
      },
    },
    '/v1/product': {
      post: {
        tags: ['Produtos'],
        summary: 'Criar produto',
        security: [{ bearerAuth: [] }],
        responses: {
          201: { description: 'Produto criado' },
          401: { description: 'Não autorizado' },
        },
      },
    },
  },
};

module.exports = swaggerDocument;
