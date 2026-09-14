/**
 * Adiciona a coluna `reprovado` na tabela Projeto, sem apagar nenhum dado
 * existente. Necessária pra distinguir campanha "pendente" (ainda não
 * revisada) de campanha "reprovada" (admin já decidiu que não).
 *
 * Uso: rodar uma única vez após atualizar o código.
 */
import { DataTypes } from 'sequelize';
import { sequelize, connectWithRetry } from '../config/database';

const run = async (): Promise<void> => {
  await connectWithRetry();
  const queryInterface = sequelize.getQueryInterface();

  const tabela = await queryInterface.describeTable('Projeto');
  if (tabela.reprovado) {
    console.log('Coluna "reprovado" já existe em Projeto. Nada a fazer.');
  } else {
    console.log('Adicionando a coluna "reprovado" na tabela Projeto...');
    await queryInterface.addColumn('Projeto', 'reprovado', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
    console.log('Coluna "reprovado" adicionada com sucesso.');
  }

  await sequelize.close();
};

run().catch((error) => {
  console.error('Erro ao adicionar a coluna "reprovado":', error);
  process.exit(1);
});
