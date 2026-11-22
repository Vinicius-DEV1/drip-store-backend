const request = require('supertest');
const app = require('../src/app');

describe('Rotas da API Drip Store', () => {
  test('GET / deve retornar status 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  test('POST /v1/user/token sem credenciais deve retornar 400', async () => {
    const res = await request(app).post('/v1/user/token').send({});
    expect(res.statusCode).toBe(400);
  });

  test('Rotas protegidas sem token devem retornar 401', async () => {
    const resUser = await request(app).put('/v1/user/1').send({});
    const resCat = await request(app).post('/v1/category').send({});
    const resProd = await request(app).post('/v1/product').send({});

    expect(resUser.statusCode).toBe(401);
    expect(resCat.statusCode).toBe(401);
    expect(resProd.statusCode).toBe(401);
  });
});
