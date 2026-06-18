require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./middleware/models');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// =========================================================================
// Configurações de Segurança e Middlewares Globais
// =========================================================================

const allowedOriginsRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:(3000|5000))?$/;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOriginsRegex.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error('CORS não permitido para esta origem'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================================================================
// Log de requisições
// =========================================================================

app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.path}`
  );
  next();
});

// =========================================================================
// Health Check
// =========================================================================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date()
  });
});

// =========================================================================
// Rotas
// =========================================================================

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/paises', require('./routes/paisesRoutes'));
app.use('/api/estados', require('./routes/estadosRoutes'));
app.use('/api/cidades', require('./routes/cidadesRoutes'));
app.use('/api/tipos-usuario', require('./routes/tiposUsuarioRoutes'));
app.use('/api/categorias', require('./routes/categoriasRoutes'));
app.use('/api/projetos', require('./routes/projetosRoutes'));
app.use('/api/info-campanha', require('./routes/infoCampanhaRoutes'));
app.use('/api/preferencias', require('./routes/preferenciasRoutes'));
app.use('/api/participacoes', require('./routes/participacoesRoutes'));
app.use('/api/avaliacoes', require('./routes/avaliacoesRoutes'));
app.use('/api/favoritos', require('./routes/favoritosRoutes'));
app.use('/api/servicos', require('./routes/servicosDisponiveisRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// =========================================================================
// 404
// =========================================================================

app.use((req, res) => {
  return res.status(404).json({
    message: 'Rota não encontrada',
    code: 'NOT_FOUND_ERROR'
  });
});

// =========================================================================
// Tratamento Global de Erros
// =========================================================================

app.use(errorHandler);

// =========================================================================
// Inicialização do Servidor
// =========================================================================

const startServer = async (retries = 10, delay = 3000) => {
  try {

    await sequelize.authenticate();

    console.log('✔ Conexão com o banco de dados estabelecida com sucesso.');
    console.log('✔ Sincronização automática desativada.');

    // NÃO USAR:
    // await sequelize.sync({ alter: true });
    // await sequelize.sync({ force: true });

    const server = app.listen(PORT, () => {
      console.log(`Servidor operacional rodando na porta ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });

    server.on('error', (err) => {
      console.error('ERRO NO SERVIDOR:', err);
    });

    server.on('close', () => {
      console.log('SERVIDOR FOI FECHADO');
    });

  } catch (error) {

    if (retries > 0) {

      console.warn(
        `Banco não disponível, tentando novamente em ${delay / 1000}s... (${retries} tentativas restantes)`
      );

      setTimeout(
        () => startServer(retries - 1, delay),
        delay
      );

    } else {

      console.error(
        'Erro crítico ao iniciar o servidor:',
        error
      );

      process.exit(1);
    }
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;