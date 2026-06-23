require('dotenv').config();

const bcrypt = require('bcryptjs');

// Mock dos modelos Sequelize
jest.mock('../../../src/middleware/models', () => ({
  Usuario: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn()
  },
  Cidade: {},
  TipoUsuario: {}
}));

const request = require('supertest');
const app = require('../../../src/index');
const { Usuario } = require('../../../src/middleware/models');

describe('Testes de Integração - Login (Auth)', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Deve autenticar com sucesso quando email e senha forem válidos', async () => {
    const senhaHash = await bcrypt.hash('StrongPassword123!', 10);

    Usuario.findOne.mockResolvedValue({
      id: 1,
      nome: 'Usuário de Teste',
      email: 'teste@email.com',
      senha: senhaHash,
      toJSON: function () { return this; }
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'teste@email.com',
        password: 'StrongPassword123!'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('message', 'Login realizado com sucesso');
  });

  test('Deve retornar 401 quando o email não existir na base de dados', async () => {
    Usuario.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'naoexiste@email.com',
        password: 'StrongPassword123!'
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('code', 'AUTHENTICATION_ERROR');
  });

  test('Deve retornar 401 quando a senha estiver incorreta', async () => {
    const senhaHash = await bcrypt.hash('SenhaCorreta123!', 10);

    Usuario.findOne.mockResolvedValue({
      id: 1,
      nome: 'Usuário de Teste',
      email: 'teste@email.com',
      senha: senhaHash,
      toJSON: function () { return this; }
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'teste@email.com',
        password: 'SenhaErrada123!'
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('code', 'AUTHENTICATION_ERROR');
  });

  test('Deve retornar 400 quando o payload estiver incompleto', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'teste@email.com' }); // sem password

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
  });

});
