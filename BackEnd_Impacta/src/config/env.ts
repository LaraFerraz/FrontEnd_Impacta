import 'dotenv/config';

type NodeEnv = 'development' | 'test' | 'production';

interface AppEnv {
  nodeEnv: NodeEnv;
  port: number;
  apiHost: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  corsOrigin: string;
  logLevel: string;
}

const nodeEnv = (process.env.NODE_ENV as NodeEnv) || 'development';

/**
 * JWT_SECRET nunca tem um fallback hardcoded, nem mesmo em desenvolvimento.
 * Isso corrige a inconsistência do projeto original, em que authRoutes.js
 * usava um fallback fixo e authMiddleware.js só travava em produção.
 * Agora a aplicação falha de forma rápida e explícita (fail-fast) em
 * qualquer ambiente caso a variável não esteja definida.
 */
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error(
    'JWT_SECRET não definido. Configure a variável de ambiente antes de iniciar a aplicação.'
  );
}

export const env: AppEnv = {
  nodeEnv,
  port: Number(process.env.PORT) || 3001,
  apiHost: process.env.API_HOST ?? '0.0.0.0',
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  logLevel: process.env.LOG_LEVEL ?? 'info'
};

export const isProduction = env.nodeEnv === 'production';
export const isTest = env.nodeEnv === 'test';
