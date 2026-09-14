/**
 * Popula o banco com dados de referencia (paises, estados, cidades,
 * categorias, tipos/status) e dados de exemplo (usuarios, projetos,
 * participacoes, etc), extraidos do dump real do banco de desenvolvimento.
 *
 * Diferente do scripts/seed.sql antigo (que tinha so 6 cidades, 5 categorias
 * e nomes de status divergentes do restante do codigo), este seed usa os
 * mesmos dados do dump real fornecido - 27 estados, 72 cidades, 12
 * categorias - e corrige um problema do dump original: os hashes de senha
 * dos usuarios de teste eram o placeholder invalido
 * "$2b$10$YourHashedPasswordHere" (nao e um hash bcrypt utilizavel). Aqui,
 * geramos hashes reais para que o login funcione de fato em ambiente de
 * desenvolvimento.
 *
 * Senha padrao de todos os usuarios de teste (exceto o usuario 11, que ja
 * tinha um hash bcrypt real e valido no dump): "Impacta@123"
 */
import bcrypt from 'bcryptjs';
import { connectWithRetry, sequelize } from '../config/database';
import {
  Pais,
  Estado,
  Cidade,
  Categoria,
  TipoUsuario,
  StatusCampanha,
  StatusParticipacao,
  StatusServico,
  Usuario,
  Projeto,
  InfoCampanha,
  Participacoes,
  Avaliacoes,
  Favoritos,
  Preferencias
} from '../models';
import { env } from '../config/env';

const SENHA_PADRAO_SEED = 'Impacta@123';
const HASH_INVALIDO_NO_DUMP = '$2b$10$YourHashedPasswordHere';

interface LookupModel {
  findOrCreate: (options: { where: { id: number }; defaults: Record<string, unknown> }) => Promise<unknown>;
}

const upsertLookup = async (model: LookupModel, rows: Array<{ id: number } & Record<string, unknown>>): Promise<void> => {
  for (const row of rows) {
    await model.findOrCreate({ where: { id: row.id }, defaults: row });
  }
};

const seedReferenceData = async (): Promise<void> => {
  console.log('Semeando dados de referencia (paises, estados, cidades, categorias, status)...');

  await upsertLookup(Pais, [{ id: 1, nome: 'Brasil' }]);

  await upsertLookup(StatusCampanha, [
    { id: 1, nome: 'Planejamento' },
    { id: 2, nome: 'Em Andamento' },
    { id: 3, nome: 'Concluida' },
    { id: 4, nome: 'Cancelada' }
  ]);

  await upsertLookup(StatusParticipacao, [
    { id: 1, nome: 'Pendente' },
    { id: 2, nome: 'Aprovada' },
    { id: 3, nome: 'Rejeitada' },
    { id: 4, nome: 'Cancelada' }
  ]);

  await upsertLookup(StatusServico, [
    { id: 1, nome: 'Disponivel' },
    { id: 2, nome: 'Preenchido' },
    { id: 3, nome: 'Cancelado' }
  ]);

  await upsertLookup(TipoUsuario, [
    { id: 1, nome: 'Admin' },
    { id: 2, nome: 'Usuario Regular' }
  ]);

  await upsertLookup(Categoria, [
    { id: 1, nome: 'Educacao' },
    { id: 2, nome: 'Saude' },
    { id: 3, nome: 'Meio Ambiente' },
    { id: 4, nome: 'Alimentacao' },
    { id: 5, nome: 'Habitacao' },
    { id: 6, nome: 'Tecnologia' },
    { id: 7, nome: 'Trabalho Social' },
    { id: 8, nome: 'Assistencia Social' },
    { id: 9, nome: 'Esportes' },
    { id: 10, nome: 'Cultura e Arte' },
    { id: 11, nome: 'Voluntariado' },
    { id: 12, nome: 'Infraestrutura' }
  ]);

  const estados = [
    { id: 1, nome: 'Acre', sigla: 'AC', pais_id: 1 },
    { id: 2, nome: 'Alagoas', sigla: 'AL', pais_id: 1 },
    { id: 3, nome: 'Amapa', sigla: 'AP', pais_id: 1 },
    { id: 4, nome: 'Amazonas', sigla: 'AM', pais_id: 1 },
    { id: 5, nome: 'Bahia', sigla: 'BA', pais_id: 1 },
    { id: 6, nome: 'Ceara', sigla: 'CE', pais_id: 1 },
    { id: 7, nome: 'Distrito Federal', sigla: 'DF', pais_id: 1 },
    { id: 8, nome: 'Espirito Santo', sigla: 'ES', pais_id: 1 },
    { id: 9, nome: 'Goias', sigla: 'GO', pais_id: 1 },
    { id: 10, nome: 'Maranhao', sigla: 'MA', pais_id: 1 },
    { id: 11, nome: 'Mato Grosso', sigla: 'MT', pais_id: 1 },
    { id: 12, nome: 'Mato Grosso do Sul', sigla: 'MS', pais_id: 1 },
    { id: 13, nome: 'Minas Gerais', sigla: 'MG', pais_id: 1 },
    { id: 14, nome: 'Para', sigla: 'PA', pais_id: 1 },
    { id: 15, nome: 'Paraiba', sigla: 'PB', pais_id: 1 },
    { id: 16, nome: 'Parana', sigla: 'PR', pais_id: 1 },
    { id: 17, nome: 'Pernambuco', sigla: 'PE', pais_id: 1 },
    { id: 18, nome: 'Piaui', sigla: 'PI', pais_id: 1 },
    { id: 19, nome: 'Rio de Janeiro', sigla: 'RJ', pais_id: 1 },
    { id: 20, nome: 'Rio Grande do Norte', sigla: 'RN', pais_id: 1 },
    { id: 21, nome: 'Rio Grande do Sul', sigla: 'RS', pais_id: 1 },
    { id: 22, nome: 'Rondonia', sigla: 'RO', pais_id: 1 },
    { id: 23, nome: 'Roraima', sigla: 'RR', pais_id: 1 },
    { id: 24, nome: 'Santa Catarina', sigla: 'SC', pais_id: 1 },
    { id: 25, nome: 'Sao Paulo', sigla: 'SP', pais_id: 1 },
    { id: 26, nome: 'Sergipe', sigla: 'SE', pais_id: 1 },
    { id: 27, nome: 'Tocantins', sigla: 'TO', pais_id: 1 }
  ];
  for (const estado of estados) {
    await Estado.findOrCreate({ where: { id: estado.id }, defaults: estado });
  }

  const cidades = [
    { id: 1, nome: 'Rio Branco', estado_id: 1 }, { id: 2, nome: 'Cruzeiro do Sul', estado_id: 1 },
    { id: 3, nome: 'Maceio', estado_id: 2 }, { id: 4, nome: 'Arapiraca', estado_id: 2 },
    { id: 5, nome: 'Macapa', estado_id: 3 }, { id: 6, nome: 'Santana', estado_id: 3 },
    { id: 7, nome: 'Manaus', estado_id: 4 }, { id: 8, nome: 'Parintins', estado_id: 4 },
    { id: 9, nome: 'Salvador', estado_id: 5 }, { id: 10, nome: 'Feira de Santana', estado_id: 5 },
    { id: 11, nome: 'Vitoria da Conquista', estado_id: 5 }, { id: 12, nome: 'Camacari', estado_id: 5 },
    { id: 13, nome: 'Fortaleza', estado_id: 6 }, { id: 14, nome: 'Caucaia', estado_id: 6 },
    { id: 15, nome: 'Juazeiro do Norte', estado_id: 6 }, { id: 16, nome: 'Brasilia', estado_id: 7 },
    { id: 17, nome: 'Vitoria', estado_id: 8 }, { id: 18, nome: 'Vila Velha', estado_id: 8 },
    { id: 19, nome: 'Serra', estado_id: 8 }, { id: 20, nome: 'Goiania', estado_id: 9 },
    { id: 21, nome: 'Aparecida de Goiania', estado_id: 9 }, { id: 22, nome: 'Anapolis', estado_id: 9 },
    { id: 23, nome: 'Sao Luis', estado_id: 10 }, { id: 24, nome: 'Imperatriz', estado_id: 10 },
    { id: 25, nome: 'Cuiaba', estado_id: 11 }, { id: 26, nome: 'Varzea Grande', estado_id: 11 },
    { id: 27, nome: 'Campo Grande', estado_id: 12 }, { id: 28, nome: 'Dourados', estado_id: 12 },
    { id: 29, nome: 'Belo Horizonte', estado_id: 13 }, { id: 30, nome: 'Uberlandia', estado_id: 13 },
    { id: 31, nome: 'Contagem', estado_id: 13 }, { id: 32, nome: 'Juiz de Fora', estado_id: 13 },
    { id: 33, nome: 'Montes Claros', estado_id: 13 }, { id: 34, nome: 'Belem', estado_id: 14 },
    { id: 35, nome: 'Ananindeua', estado_id: 14 }, { id: 36, nome: 'Joao Pessoa', estado_id: 15 },
    { id: 37, nome: 'Campina Grande', estado_id: 15 }, { id: 38, nome: 'Curitiba', estado_id: 16 },
    { id: 39, nome: 'Londrina', estado_id: 16 }, { id: 40, nome: 'Maringa', estado_id: 16 },
    { id: 41, nome: 'Ponta Grossa', estado_id: 16 }, { id: 42, nome: 'Recife', estado_id: 17 },
    { id: 43, nome: 'Jaboatao dos Guararapes', estado_id: 17 }, { id: 44, nome: 'Olinda', estado_id: 17 },
    { id: 45, nome: 'Caruaru', estado_id: 17 }, { id: 46, nome: 'Teresina', estado_id: 18 },
    { id: 47, nome: 'Parnaiba', estado_id: 18 }, { id: 48, nome: 'Rio de Janeiro', estado_id: 19 },
    { id: 49, nome: 'Niteroi', estado_id: 19 }, { id: 50, nome: 'Duque de Caxias', estado_id: 19 },
    { id: 51, nome: 'Sao Goncalo', estado_id: 19 }, { id: 52, nome: 'Natal', estado_id: 20 },
    { id: 53, nome: 'Mossoro', estado_id: 20 }, { id: 54, nome: 'Porto Alegre', estado_id: 21 },
    { id: 55, nome: 'Caxias do Sul', estado_id: 21 }, { id: 56, nome: 'Pelotas', estado_id: 21 },
    { id: 57, nome: 'Santa Maria', estado_id: 21 }, { id: 58, nome: 'Porto Velho', estado_id: 22 },
    { id: 59, nome: 'Boa Vista', estado_id: 23 }, { id: 60, nome: 'Florianopolis', estado_id: 24 },
    { id: 61, nome: 'Joinville', estado_id: 24 }, { id: 62, nome: 'Blumenau', estado_id: 24 },
    { id: 63, nome: 'Sao Paulo', estado_id: 25 }, { id: 64, nome: 'Guarulhos', estado_id: 25 },
    { id: 65, nome: 'Campinas', estado_id: 25 }, { id: 66, nome: 'Sao Bernardo do Campo', estado_id: 25 },
    { id: 67, nome: 'Santo Andre', estado_id: 25 }, { id: 68, nome: 'Osasco', estado_id: 25 },
    { id: 69, nome: 'Sorocaba', estado_id: 25 }, { id: 70, nome: 'Ribeirao Preto', estado_id: 25 },
    { id: 71, nome: 'Aracaju', estado_id: 26 }, { id: 72, nome: 'Palmas', estado_id: 27 }
  ];
  for (const cidade of cidades) {
    await Cidade.findOrCreate({ where: { id: cidade.id }, defaults: cidade });
  }
};

const seedSampleData = async (): Promise<void> => {
  console.log('Semeando dados de exemplo (usuarios, projetos, participacoes...)...');

  const hashPadrao = await bcrypt.hash(SENHA_PADRAO_SEED, 10);

  const usuarios = [
    { id: 1, nome: 'Admin Impacta', email: 'admin@impacta.com', senha: hashPadrao, telefone: '11999999999', cpf: '12345678901234', cidade_id: 63, tipo_usuario_id: 1 },
    { id: 2, nome: 'Joao Silva', email: 'joao@test.com', senha: hashPadrao, telefone: '11988888888', cpf: '12345678901235', cidade_id: 63, tipo_usuario_id: 2 },
    { id: 3, nome: 'Maria Santos', email: 'maria@test.com', senha: hashPadrao, telefone: '21987654321', cpf: '12345678901236', cidade_id: 48, tipo_usuario_id: 2 },
    { id: 4, nome: 'Pedro Oliveira', email: 'pedro@test.com', senha: hashPadrao, telefone: '85986543210', cpf: '12345678901237', cidade_id: 13, tipo_usuario_id: 2 },
    { id: 5, nome: 'Ana Costa', email: 'ana@test.com', senha: hashPadrao, telefone: '31998765432', cpf: '12345678901238', cidade_id: 29, tipo_usuario_id: 2 },
    { id: 6, nome: 'Carlos Mendes', email: 'carlos@test.com', senha: hashPadrao, telefone: '47984321098', cpf: '12345678901239', cidade_id: 60, tipo_usuario_id: 2 },
    { id: 7, nome: 'Lucia Ferreira', email: 'lucia@test.com', senha: hashPadrao, telefone: '48987654321', cpf: '12345678901240', cidade_id: 62, tipo_usuario_id: 2 },
    { id: 8, nome: 'Roberto Alves', email: 'roberto@test.com', senha: hashPadrao, telefone: '51988776655', cpf: '12345678901241', cidade_id: 54, tipo_usuario_id: 2 },
    { id: 9, nome: 'Fernanda Gomes', email: 'fernanda@test.com', senha: hashPadrao, telefone: '61987654321', cpf: '12345678901242', cidade_id: 16, tipo_usuario_id: 2 },
    { id: 10, nome: 'Giovanni Santos', email: 'giovanni@test.com', senha: hashPadrao, telefone: '85988776655', cpf: '12345678901243', cidade_id: 71, tipo_usuario_id: 2 },
    { id: 11, nome: 'Hiago Nascimento Silva', email: 'hiagodonascimentosilva04@gmail.com', senha: '$2a$10$sQGrKobI31xMoqh1Jpd/r.9Kf9KDqvDGogd36Ql7c/EvAooKk34J6', telefone: '(44) 99807-2343', cpf: '128.431.259-36', cidade_id: null, tipo_usuario_id: 2 }
  ];
  for (const usuario of usuarios) {
    await Usuario.findOrCreate({ where: { id: usuario.id }, defaults: usuario });
  }

  const projetos = [
    { id: 1, titulo: 'Limpeza da Praia de Copacabana', descricao: 'Campanha de limpeza e conscientizacao ambiental na praia de Copacabana. Vamos juntos cuidar do nosso litoral!', categoria_id: 3, criador_id: 3, cidade_id: 48, data_inicio: '2026-06-01', data_fim: '2026-06-30', meta_participantes: 150, status_id: 2 },
    { id: 2, titulo: 'Educacao Digital para Idosos', descricao: 'Oferecemos aulas gratuitas de informatica e internet para idosos. Ajude a reduzir a exclusao digital!', categoria_id: 1, criador_id: 2, cidade_id: 63, data_inicio: '2026-05-15', data_fim: '2026-08-15', meta_participantes: 200, status_id: 2 },
    { id: 3, titulo: 'Horta Comunitaria Sustentavel', descricao: 'Criacao de uma horta comunitaria no bairro para promover alimentacao saudavel e educacao ambiental.', categoria_id: 3, criador_id: 5, cidade_id: 29, data_inicio: '2026-07-01', data_fim: '2026-12-31', meta_participantes: 100, status_id: 1 },
    { id: 4, titulo: 'Campanha de Vacinacao Infantil', descricao: 'Mobilizacao para aumentar as taxas de vacinacao em criancas menores de 5 anos.', categoria_id: 2, criador_id: 4, cidade_id: 13, data_inicio: '2026-06-10', data_fim: '2026-07-10', meta_participantes: 500, status_id: 2 },
    { id: 5, titulo: 'Reforma da Escola Municipal', descricao: 'Voluntarios ajudando na reforma e pintura da escola municipal da comunidade.', categoria_id: 1, criador_id: 7, cidade_id: 62, data_inicio: '2026-05-20', data_fim: '2026-07-20', meta_participantes: 80, status_id: 1 },
    { id: 6, titulo: 'Coleta e Reciclagem de Eletronicos', descricao: 'Campanha de coleta de lixo eletronico para reciclagem responsavel e educacao sobre sustentabilidade.', categoria_id: 3, criador_id: 6, cidade_id: 60, data_inicio: '2026-06-15', data_fim: '2026-08-15', meta_participantes: 120, status_id: 2 },
    { id: 7, titulo: 'Distribuicao de Alimentos', descricao: 'Arrecadacao e distribuicao de alimentos para familias em situacao de vulnerabilidade.', categoria_id: 8, criador_id: 9, cidade_id: 16, data_inicio: '2026-05-01', data_fim: '2026-05-30', meta_participantes: 200, status_id: 2 },
    { id: 8, titulo: 'Aulas de Reforco Escolar', descricao: 'Oferecemos aulas gratuitas de reforco em Portugues, Matematica e Ciencias para alunos do ensino fundamental.', categoria_id: 1, criador_id: 2, cidade_id: 70, data_inicio: '2026-04-15', data_fim: '2026-12-31', meta_participantes: 50, status_id: 2 },
    { id: 9, titulo: 'Programa de Saude Preventiva', descricao: 'Campanha de conscientizacao sobre saude preventiva e distribuicao de panfletos educativos.', categoria_id: 2, criador_id: 8, cidade_id: 54, data_inicio: '2026-06-20', data_fim: '2026-07-20', meta_participantes: 300, status_id: 1 },
    { id: 10, titulo: 'Iniciativa de Empoderamento Feminino', descricao: 'Workshops e palestras sobre empoderamento feminino, direitos e autonomia financeira.', categoria_id: 1, criador_id: 3, cidade_id: 71, data_inicio: '2026-07-01', data_fim: '2026-09-30', meta_participantes: 150, status_id: 1 }
  ];
  for (const projeto of projetos) {
    await Projeto.findOrCreate({ where: { id: projeto.id }, defaults: projeto });
  }

  const infosCampanha = [
    { projeto_id: 1, objetivos: 'Limpar 5km de praia e conscientizar sobre poluicao marinha', publico_alvo: 'Adultos e jovens com idade minima de 16 anos', impacto_esperado: 'Remocao de 5 toneladas de residuos e sensibilizacao de 500+ pessoas', regras: 'Trazer equipamento de protecao pessoal. Menores de 18 devem ser acompanhados por responsavel.', observacoes: 'Contato: joao@impacta.com' },
    { projeto_id: 2, objetivos: 'Ensinar nocoes basicas de informatica e navegacao na internet', publico_alvo: 'Idosos com idade acima de 60 anos', impacto_esperado: 'Capacitacao de 100+ pessoas na area digital', regras: 'Sem pre-requisitos. Aulas em grupos de 10-15 pessoas', observacoes: 'Local: Centro Comunitario de Sao Paulo' },
    { projeto_id: 3, objetivos: 'Criar espaco verde e produzir alimentos organicamente', publico_alvo: 'Moradores do bairro, especialmente criancas e familias', impacto_esperado: 'Reducao de gastos com alimentacao e educacao ambiental', regras: 'Participacao semanal minima de 4 horas', observacoes: 'Contato: ana@impacta.com' },
    { projeto_id: 4, objetivos: 'Aumentar cobertura vacinal de menores de 5 anos', publico_alvo: 'Pais e responsaveis de criancas menores de 5 anos', impacto_esperado: 'Vacinacao de 500+ criancas', regras: 'Voluntarios devem ter experiencia ou treinamento em saude publica', observacoes: 'Apoio de profissionais de saude local' },
    { projeto_id: 5, objetivos: 'Melhorar infraestrutura da escola municipal', publico_alvo: 'Alunos, pais e comunidade geral', impacto_esperado: 'Escola com infraestrutura melhorada e maior atratividade', regras: 'Experiencia em reforma e pintura e bem-vinda mas nao obrigatoria', observacoes: 'Horarios podem ser ajustados conforme disponibilidade' },
    { projeto_id: 6, objetivos: 'Coletar e reciclar residuos eletronicos de forma responsavel', publico_alvo: 'Moradores e empresas com equipamentos obsoletos', impacto_esperado: 'Coleta de 2 toneladas de eletronicos', regras: 'Equipamentos devem estar seguros para manipulacao', observacoes: 'Parceria com empresas de reciclagem certificadas' },
    { projeto_id: 7, objetivos: 'Garantir seguranca alimentar para familias necessitadas', publico_alvo: 'Familias de baixa renda inscritas no programa social', impacto_esperado: 'Alimentacao garantida para 200+ pessoas mensalmente', regras: 'Voluntarios devem ajudar na selecao, embalagem e distribuicao', observacoes: 'Contato: fernando@impacta.com' },
    { projeto_id: 8, objetivos: 'Melhorar desempenho academico em disciplinas essenciais', publico_alvo: 'Alunos do ensino fundamental com dificuldades de aprendizado', impacto_esperado: 'Melhora de 30% no desempenho academico', regras: 'Maximo 15 alunos por turma. Frequencia minima de 80%', observacoes: 'Aulas 3x por semana, 1,5h cada' },
    { projeto_id: 9, objetivos: 'Promover habitos de vida saudavel na comunidade', publico_alvo: 'Moradores de todas as idades', impacto_esperado: 'Conscientizacao de 500+ pessoas', regras: 'Voluntarios devem ser sensibilizados sobre saude preventiva', observacoes: 'Material educativo: panfletos e videos' },
    { projeto_id: 10, objetivos: 'Empoderar mulheres atraves de educacao e capacitacao', publico_alvo: 'Mulheres de 18 a 60 anos de todas as classes sociais', impacto_esperado: 'Capacitacao de 150+ mulheres e aumento de autonomia', regras: 'Espaco seguro para discussao e aprendizado. Palestras em portugues', observacoes: 'Oferecemos certificados de participacao' }
  ];
  for (const info of infosCampanha) {
    await InfoCampanha.findOrCreate({ where: { projeto_id: info.projeto_id }, defaults: info });
  }

  const participacoes = [
    { id: 1, usuario_id: 1, projeto_id: 1, status_participacao_id: 1 },
    { id: 2, usuario_id: 1, projeto_id: 5, status_participacao_id: 1 },
    { id: 3, usuario_id: 1, projeto_id: 2, status_participacao_id: 1 }
  ];
  for (const participacao of participacoes) {
    await Participacoes.findOrCreate({ where: { id: participacao.id }, defaults: participacao });
  }

  const avaliacoes = [
    { id: 1, usuario_id: 1, projeto_id: 10, nota: 5 },
    { id: 2, usuario_id: 1, projeto_id: 1, nota: 5 },
    { id: 3, usuario_id: 1, projeto_id: 2, nota: 5 },
    { id: 4, usuario_id: 11, projeto_id: 3, nota: 5 },
    { id: 5, usuario_id: 11, projeto_id: 2, nota: 5 }
  ];
  for (const avaliacao of avaliacoes) {
    await Avaliacoes.findOrCreate({ where: { id: avaliacao.id }, defaults: avaliacao });
  }

  const favoritos = [
    { id: 1, usuario_id: 11, projeto_id: 1 },
    { id: 2, usuario_id: 11, projeto_id: 2 }
  ];
  for (const favorito of favoritos) {
    await Favoritos.findOrCreate({ where: { id: favorito.id }, defaults: favorito });
  }

  const preferencias = [
    { id: 1, usuario_id: 11, categoria_id: 2 },
    { id: 2, usuario_id: 11, categoria_id: 1 },
    { id: 3, usuario_id: 11, categoria_id: 4 },
    { id: 4, usuario_id: 11, categoria_id: 6 }
  ];
  for (const preferencia of preferencias) {
    await Preferencias.findOrCreate({ where: { id: preferencia.id }, defaults: preferencia });
  }
};

const run = async (): Promise<void> => {
  if (env.nodeEnv === 'production') {
    console.error('Este script nao deve ser executado em producao. Abortando.');
    process.exit(1);
  }

  await connectWithRetry();
  await seedReferenceData();
  await seedSampleData();

  console.log('\nSeed concluido com sucesso.');
  console.log(`Usuarios de teste (exceto id 11) usam a senha padrao: "${SENHA_PADRAO_SEED}"`);
  console.log(`(hash de placeholder invalido do dump original substituido: ${HASH_INVALIDO_NO_DUMP})`);

  await sequelize.close();
};

run().catch(async (error) => {
  console.error('Erro ao popular o banco:', error);
  await sequelize.close();
  process.exit(1);
});
