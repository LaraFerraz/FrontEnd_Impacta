import 'dotenv/config';
import { Dialect } from 'sequelize';

export interface DatabaseEnvConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: Dialect;
}

const buildConfig = (): DatabaseEnvConfig => ({
  username: process.env.DB_USER ?? '',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? '',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  dialect: 'mysql'
});

const config: Record<'development' | 'test' | 'production', DatabaseEnvConfig> = {
  development: buildConfig(),
  test: buildConfig(),
  production: buildConfig()
};

export default config;
