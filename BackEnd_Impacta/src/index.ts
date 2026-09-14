import { createApp } from './app';
import { env } from './config/env';
import { connectWithRetry } from './config/database';
import './models'; // garante que os models e associações sejam registrados antes do app subir

const startServer = async (): Promise<void> => {
  try {
    await connectWithRetry();
    console.log('Sincronização automática desativada (uso de migrations/seed apenas).');

    const app = createApp();
    const server = app.listen(env.port, () => {
      console.log(`Servidor operacional rodando na porta ${env.port}`);
      console.log(`Health check: http://localhost:${env.port}/api/health`);
    });

    server.on('error', (err) => {
      console.error('ERRO NO SERVIDOR:', err);
    });

    server.on('close', () => {
      console.log('SERVIDOR FOI FECHADO');
    });
  } catch (error) {
    console.error('Erro crítico ao iniciar o servidor:', error);
    process.exit(1);
  }
};

if (env.nodeEnv !== 'test') {
  void startServer();
}
