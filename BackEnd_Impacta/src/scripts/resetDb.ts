/**
 * Recria o schema completo do banco a partir dos models Sequelize.
 *
 * Por que não usar o antigo scripts/reset-db.sql?
 * Ele criava só 6 das 16 tabelas, usava nomes de coluna (createdAt/updatedAt)
 * que os models não têm (timestamps: false) e nomes de tabela inconsistentes
 * com o que o seed.sql esperava. Gerar o schema a partir dos models garante
 * que o banco sempre bata com o código.
 *
 * ATENÇÃO: isso apaga todos os dados existentes (DROP + CREATE). Uso restrito
 * a ambiente de desenvolvimento/teste — nunca rodar contra produção.
 */
import { sequelize, connectWithRetry } from '../config/database';
import '../models';
import { env } from '../config/env';

const run = async (): Promise<void> => {
  if (env.nodeEnv === 'production') {
    console.error('Este script não deve ser executado em produção. Abortando.');
    process.exit(1);
  }

  await connectWithRetry();

  console.log('Recriando o schema (DROP + CREATE de todas as tabelas)...');
  await sequelize.sync({ force: true });
  console.log('Schema recriado com sucesso a partir dos models TypeScript.');

  await sequelize.close();
};

run().catch((error) => {
  console.error('Erro ao recriar o schema:', error);
  process.exit(1);
});
