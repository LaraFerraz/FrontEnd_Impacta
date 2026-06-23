require('dotenv').config();

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'impacta-secret-key-2026-dev-only';

const gerarToken = (id = 1) =>
  jwt.sign({ id, email: 'teste@email.com', nome: 'Teste' }, JWT_SECRET);

const favoritoMock = {
  id: 1,
  usuario_id: 1,
  projeto_id: 10,
  toJSON: function () { return this; },
  destroy: jest.fn().mockResolvedValue(true)
};

jest.mock('../../../src/middleware/models', () => ({
  Favoritos: {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn()
  },
  Usuario: {},
  Projeto: {}
}));

const request = require('supertest');
const app = require('../../../src/index');
const { Favoritos } = require('../../../src/middleware/models');

describe('Testes de Integração - CRUD de Favoritos', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------
  // LISTAR
  // -------------------------
  test('Deve listar favoritos do próprio usuário com sucesso (GET /api/favoritos/usuario/:id)', async () => {
    Favoritos.findAndCountAll.mockResolvedValue({ count: 1, rows: [favoritoMock] });

    const response = await request(app)
      .get('/api/favoritos/usuario/1')
      .set('Authorization', `Bearer ${gerarToken(1)}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('pagination');
  });

  test('Deve retornar 403 ao tentar listar favoritos de outro usuário', async () => {
    const response = await request(app)
      .get('/api/favoritos/usuario/2')
      .set('Authorization', `Bearer ${gerarToken(1)}`); // token do usuário 1

    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('code', 'AUTHORIZATION_ERROR');
  });

  // -------------------------
  // BUSCAR POR ID
  // -------------------------
  test('Deve retornar um favorito por ID (GET /api/favoritos/:id)', async () => {
    Favoritos.findByPk.mockResolvedValue({ ...favoritoMock, usuario_id: 1 });

    const response = await request(app)
      .get('/api/favoritos/1')
      .set('Authorization', `Bearer ${gerarToken(1)}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('data');
  });

  test('Deve retornar 404 quando o favorito não existir (GET /api/favoritos/:id)', async () => {
    Favoritos.findByPk.mockResolvedValue(null);

    const response = await request(app)
      .get('/api/favoritos/999')
      .set('Authorization', `Bearer ${gerarToken(1)}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('code', 'NOT_FOUND_ERROR');
  });

  // -------------------------
  // CRIAR
  // -------------------------
  test('Deve adicionar favorito com sucesso (POST /api/favoritos)', async () => {
    Favoritos.create.mockResolvedValue(favoritoMock);
    Favoritos.findByPk.mockResolvedValue(favoritoMock);

    const response = await request(app)
      .post('/api/favoritos')
      .set('Authorization', `Bearer ${gerarToken(1)}`)
      .send({ usuario_id: 1, projeto_id: 10 });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'Projeto adicionado aos favoritos com sucesso');
    expect(response.body).toHaveProperty('data');
  });

  test('Deve retornar 400 quando campos obrigatórios faltarem (POST /api/favoritos)', async () => {
    const response = await request(app)
      .post('/api/favoritos')
      .set('Authorization', `Bearer ${gerarToken(1)}`)
      .send({ usuario_id: 1 }); // sem projeto_id

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
  });

  test('Deve retornar 403 ao tentar criar favorito para outro usuário (POST /api/favoritos)', async () => {
    const response = await request(app)
      .post('/api/favoritos')
      .set('Authorization', `Bearer ${gerarToken(1)}`) // token do usuário 1
      .send({ usuario_id: 2, projeto_id: 10 }); // tentando criar para usuário 2

    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('code', 'AUTHORIZATION_ERROR');
  });

  // -------------------------
  // EXCLUIR
  // -------------------------
  test('Deve remover favorito com sucesso (DELETE /api/favoritos/:id)', async () => {
    Favoritos.findByPk.mockResolvedValue({ ...favoritoMock, usuario_id: 1 });

    const response = await request(app)
      .delete('/api/favoritos/1')
      .set('Authorization', `Bearer ${gerarToken(1)}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Projeto removido dos favoritos com sucesso');
  });

  test('Deve retornar 404 ao tentar remover favorito inexistente (DELETE /api/favoritos/:id)', async () => {
    Favoritos.findByPk.mockResolvedValue(null);

    const response = await request(app)
      .delete('/api/favoritos/999')
      .set('Authorization', `Bearer ${gerarToken(1)}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('code', 'NOT_FOUND_ERROR');
  });

  test('Deve retornar 403 ao tentar remover favorito de outro usuário (DELETE /api/favoritos/:id)', async () => {
    Favoritos.findByPk.mockResolvedValue({ ...favoritoMock, usuario_id: 2 });

    const response = await request(app)
      .delete('/api/favoritos/1')
      .set('Authorization', `Bearer ${gerarToken(1)}`); // token do usuário 1

    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('code', 'AUTHORIZATION_ERROR');
  });

});
