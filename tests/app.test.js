const request = require('supertest');
const app = require('../src/app');

describe('Testes da Rota Principal', () => {
  test('Deve responder com status 200 e JSON correto na rota GET /', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('OK');
    expect(response.body).toHaveProperty('status');
    expect(response.body.status).toBe('online');
    expect(response.body).toHaveProperty('timestamp');
  });
});
