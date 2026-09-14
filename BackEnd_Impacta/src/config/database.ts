import { Sequelize } from 'sequelize';
import dbConfig from './config';
import { isTest } from './env';

const activeConfig = dbConfig[isTest ? 'test' : (process.env.NODE_ENV as 'development' | 'production') || 'development'];

export const sequelize = new Sequelize(
  activeConfig.database,
  activeConfig.username,
  activeConfig.password,
  {
    host: activeConfig.host,
    port: activeConfig.port,
    dialect: activeConfig.dialect,
    logging: false,
    define: {
      underscored: false
    }
  }
);

const RETRY_ATTEMPTS = 5;
const RETRY_DELAY_MS = 3000;

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Testa a conexão com o banco, tentando novamente algumas vezes antes de desistir.
 * Útil em ambientes Docker, onde o container do MySQL pode não estar pronto
 * no exato momento em que o container da API sobe.
 */
export const connectWithRetry = async (
  attempts: number = RETRY_ATTEMPTS,
  delayMs: number = RETRY_DELAY_MS
): Promise<void> => {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await sequelize.authenticate();
      // eslint-disable-next-line no-console
      console.log('Conexão com o banco de dados estabelecida com sucesso.');
      return;
    } catch (error) {
      const isLastAttempt = attempt === attempts;
      // eslint-disable-next-line no-console
      console.error(
        `Falha ao conectar ao banco (tentativa ${attempt}/${attempts}).`,
        error instanceof Error ? error.message : error
      );

      if (isLastAttempt) {
        throw error;
      }

      await wait(delayMs);
    }
  }
};
