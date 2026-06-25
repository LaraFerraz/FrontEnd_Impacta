require('dotenv').config();

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'impacta-secret-key-2026-dev-only';

const gerarToken = (id = 1) =>
  jwt.sign({ id, email: 'teste@email.com', nome: 'Teste' }, JWT_SECRET);

const projetoMock = {
  id: 1,
  titulo: 'Projeto Teste',
  descricao: 'Descrição do projeto teste',
  categoria_id: 1,
  criador_id: 1,
  cidade_id: 1,
  status_id: 1,
  toJSON: function () { return this; },
  save: jest.fn().mockResolvedValue(true),
  destroy: jest.fn().mockResolvedValue(true)
};

jest.mock('../../../src/middleware/models', () => ({
  Projeto: {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn()
  },
  Categoria: {},
  Usuario: {},
  Cidade: {},
  StatusCampanha: {},
  Info_campanha: {},
  Servicos_disponiveis: { update: jest.fn().mockResolvedValue([0]) },
  StatusServico: {},
  Participacoes: {},
  StatusParticipacao: {},
  Avaliacoes: {}
}));

const request = require('supertest');
const app = require('../../../src/index');
const { Projeto } = require('../../../src/middleware/models');

describe('Testes de Integração - CRUD de Projetos', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------
  // LISTAR
  // -------------------------
  test('Deve listar projetos com sucesso (GET /api/projetos)', async () => {
    Projeto.findAndCountAll.mockResolvedValue({ count: 1, rows: [projetoMock] });

    const response = await request(app).get('/api/projetos');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('pagination');
  });

  // -------------------------
  // BUSCAR POR ID
  // -------------------------
  test('Deve retornar um projeto específico por ID (GET /api/projetos/:id)', async () => {
    Projeto.findByPk.mockResolvedValue(projetoMock);

    const response = await request(app).get('/api/projetos/1');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('data');
  });

  test('Deve retornar 404 quando o projeto não existir (GET /api/projetos/:id)', async () => {
    Projeto.findByPk.mockResolvedValue(null);

    const response = await request(app).get('/api/projetos/999');

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('code', 'NOT_FOUND_ERROR');
  });

  // -------------------------
  // CRIAR
  // -------------------------
  test('Deve criar um projeto com sucesso (POST /api/projetos)', async () => {
    Projeto.create.mockResolvedValue(projetoMock);
    Projeto.findByPk.mockResolvedValue(projetoMock);

    const response = await request(app)
      .post('/api/projetos')
      .set('Authorization', `Bearer ${gerarToken(1)}`)
      .send({
        titulo: 'Projeto Teste',
        descricao: 'Descrição do projeto teste',
        categoria_id: 1,
        criador_id: 1,
        cidade_id: 1,
        status_id: 1
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'Projeto criado com sucesso');
    expect(response.body).toHaveProperty('data');
  });

  test('Deve retornar 400 quando campos obrigatórios faltarem (POST /api/projetos)', async () => {
    const response = await request(app)
      .post('/api/projetos')
      .set('Authorization', `Bearer ${gerarToken(1)}`)
      .send({ titulo: 'Só o título' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
  });

  test('Deve retornar 403 quando tentar criar projeto para outro usuário (POST /api/projetos)', async () => {
    const response = await request(app)
      .post('/api/projetos')
      .set('Authorization', `Bearer ${gerarToken(1)}`) // token do usuário 1
      .send({
        titulo: 'Projeto',
        descricao: 'Descrição',
        categoria_id: 1,
        criador_id: 2, // tentando criar como usuário 2
        cidade_id: 1,
        status_id: 1
      });

    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('code', 'AUTHORIZATION_ERROR');
  });

  // -------------------------
  // EDITAR
  // -------------------------
  test('Deve atualizar um projeto com sucesso (PUT /api/projetos/:id)', async () => {
    Projeto.findByPk.mockResolvedValue({ ...projetoMock, criador_id: 1 });

    const response = await request(app)
      .put('/api/projetos/1')
      .set('Authorization', `Bearer ${gerarToken(1)}`)
      .send({ titulo: 'Título Atualizado' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Projeto updated com sucesso');
  });

  test('Deve retornar 404 ao tentar editar projeto inexistente (PUT /api/projetos/:id)', async () => {
    Projeto.findByPk.mockResolvedValue(null);

    const response = await request(app)
      .put('/api/projetos/999')
      .set('Authorization', `Bearer ${gerarToken(1)}`)
      .send({ titulo: 'Título' });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('code', 'NOT_FOUND_ERROR');
  });

  // -------------------------
  // EXCLUIR
  // -------------------------
  test('Deve excluir um projeto com sucesso (DELETE /api/projetos/:id)', async () => {
    Projeto.findByPk.mockResolvedValue({ ...projetoMock, criador_id: 1 });

    const response = await request(app)
      .delete('/api/projetos/1')
      .set('Authorization', `Bearer ${gerarToken(1)}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Projeto deletado com sucesso');
  });

  test('Deve retornar 404 ao tentar excluir projeto inexistente (DELETE /api/projetos/:id)', async () => {
    Projeto.findByPk.mockResolvedValue(null);

    const response = await request(app)
      .delete('/api/projetos/999')
      .set('Authorization', `Bearer ${gerarToken(1)}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('code', 'NOT_FOUND_ERROR');
  });

  test('Deve retornar 403 ao tentar excluir projeto de outro usuário (DELETE /api/projetos/:id)', async () => {
    Projeto.findByPk.mockResolvedValue({ ...projetoMock, criador_id: 2 });

    const response = await request(app)
      .delete('/api/projetos/1')
      .set('Authorization', `Bearer ${gerarToken(1)}`); // token do usuário 1

    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('code', 'AUTHORIZATION_ERROR');
  });

});
