import path from 'path';
import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import paisesRoutes from './routes/paisesRoutes';
import estadosRoutes from './routes/estadosRoutes';
import cidadesRoutes from './routes/cidadesRoutes';
import tiposUsuarioRoutes from './routes/tiposUsuarioRoutes';
import categoriasRoutes from './routes/categoriasRoutes';
import projetosRoutes from './routes/projetosRoutes';
import infoCampanhaRoutes from './routes/infoCampanhaRoutes';
import preferenciasRoutes from './routes/preferenciasRoutes';
import participacoesRoutes from './routes/participacoesRoutes';
import avaliacoesRoutes from './routes/avaliacoesRoutes';
import favoritosRoutes from './routes/favoritosRoutes';
import servicosDisponiveisRoutes from './routes/servicosDisponiveisRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import { statusCampanhaRoutes, statusParticipacaoRoutes, statusServicoRoutes } from './routes/statusRoutes';

export const createApp = (): Express => {
  const app = express();

  // ===========================================================================
  // Segurança e middlewares globais
  // ===========================================================================

  // Mesma allowlist restrita a localhost do projeto original, com o adicional
  // de aceitar a origem configurada em CORS_ORIGIN (antes definida no .env
  // mas nunca lida pelo app.js original).
  const allowedOriginsRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:(3000|5000))?$/;

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOriginsRegex.test(origin) || origin === env.corsOrigin) {
          callback(null, true);
          return;
        }
        callback(new Error('CORS não permitido para esta origem'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve as imagens enviadas (fotos de perfil, imagens de campanha).
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  // ===========================================================================
  // Health check
  // ===========================================================================

  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
  });

  // ===========================================================================
  // Rotas
  // ===========================================================================

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/paises', paisesRoutes);
  app.use('/api/estados', estadosRoutes);
  app.use('/api/cidades', cidadesRoutes);
  app.use('/api/tipos-usuario', tiposUsuarioRoutes);
  app.use('/api/categorias', categoriasRoutes);
  app.use('/api/projetos', projetosRoutes);
  app.use('/api/info-campanha', infoCampanhaRoutes);
  app.use('/api/preferencias', preferenciasRoutes);
  app.use('/api/participacoes', participacoesRoutes);
  app.use('/api/avaliacoes', avaliacoesRoutes);
  app.use('/api/favoritos', favoritosRoutes);
  app.use('/api/servicos', servicosDisponiveisRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  // Rotas de status: ausentes no projeto original (nenhum CRUD exposto para
  // Status_campanha / Status_participacao / Status_servico), adicionadas aqui
  // por consistência arquitetural com as demais entidades de referência.
  app.use('/api/status-campanha', statusCampanhaRoutes);
  app.use('/api/status-participacao', statusParticipacaoRoutes);
  app.use('/api/status-servico', statusServicoRoutes);

  // ===========================================================================
  // 404
  // ===========================================================================

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: 'Rota não encontrada', code: 'NOT_FOUND_ERROR' });
  });

  // ===========================================================================
  // Tratamento global de erros (deve ser o último middleware registrado)
  // ===========================================================================

  console.log('DEBUG errorHandler:', typeof errorHandler, errorHandler);
app.use(errorHandler);

  return app;
};
