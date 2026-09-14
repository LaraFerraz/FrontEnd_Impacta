/**
 * IDs de status fixados por regra de negócio (tabelas de apoio Status_*).
 *
 * IMPORTANTE: o valor de campanha ativa foi originalmente hardcoded como 1
 * em todo o projeto (JS e na primeira versão desta migração), mas o dump
 * real do banco mostra que Status_campanha é:
 *   1 = 'Planejamento', 2 = 'Em Andamento', 3 = 'Concluida', 4 = 'Cancelada'
 * ou seja, a campanha realmente ativa é a de id 2 ('Em Andamento'), não 1.
 * Centralizado aqui para não espalhar esse "número mágico" em vários
 * arquivos e facilitar a correção caso o seed do banco mude novamente.
 */
export const STATUS_CAMPANHA = {
  PLANEJAMENTO: 1,
  EM_ANDAMENTO: 2,
  CONCLUIDA: 3,
  CANCELADA: 4
} as const;

export const STATUS_CAMPANHA_ATIVA = STATUS_CAMPANHA.EM_ANDAMENTO;

export const STATUS_PARTICIPACAO = {
  PENDENTE: 1,
  APROVADA: 2,
  REJEITADA: 3,
  CANCELADA: 4
} as const;

export const STATUS_SERVICO = {
  DISPONIVEL: 1,
  PREENCHIDO: 2,
  CANCELADO: 3
} as const;
