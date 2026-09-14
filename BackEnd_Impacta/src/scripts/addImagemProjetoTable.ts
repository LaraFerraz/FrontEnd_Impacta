/**
 * Cria a tabela ImagemProjeto (galeria de fotos das campanhas) sem tocar
 * nas demais tabelas nem apagar dados existentes — diferente do db:reset,
 * que recria o schema inteiro do zero.
 *
 * Uso: rodar uma única vez após atualizar o código com o suporte a
 * galeria de imagens.
 */
import { sequelize, connectWithRetry } from '../config/database';
import '../models';
import { ImagemProjeto } from '../models';

const run = async (): Promise<void> => {
  await connectWithRetry();

  console.log('Criando a tabela ImagemProjeto (se ainda não existir)...');
  await ImagemProjeto.sync();
  console.log('Tabela ImagemProjeto pronta. Nenhuma outra tabela foi alterada.');

  await sequelize.close();
};

run().catch((error) => {
  console.error('Erro ao criar a tabela ImagemProjeto:', error);
  process.exit(1);
});
