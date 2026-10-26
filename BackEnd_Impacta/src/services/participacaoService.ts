import { Participacoes, Usuario, Projeto, ServicosDisponiveis, StatusParticipacao, Categoria, StatusCampanha } from '../models';
import { AuthorizationError, BusinessRuleError, ErrorDetail, NotFoundError, ValidationError } from '../utils/errors';
import { findByIdOrFail, listPaginated, ListResult } from '../utils/crudHelpers';
import { STATUS_CAMPANHA_ATIVA, STATUS_PARTICIPACAO } from '../utils/businessConstants';

const STATUS_PARTICIPACAO_PADRAO = STATUS_PARTICIPACAO.PENDENTE;

const INCLUDES_PADRAO = [
  { model: Usuario, as: 'usuario' as const, attributes: ['id', 'nome', 'email'] },
  { model: Projeto, as: 'projeto' as const, attributes: ['id', 'titulo'] },
  { model: ServicosDisponiveis, as: 'servico' as const, attributes: ['id', 'nome_servico'], required: false },
  { model: StatusParticipacao, as: 'status' as const, attributes: ['id', 'nome'] }
];

export interface ParticipacaoFiltros {
  usuario_id?: unknown;
  projeto_id?: unknown;
  status_participacao_id?: unknown;
  page?: unknown;
  limit?: unknown;
}

export interface CreateParticipacaoInput {
  usuario_id?: number;
  projeto_id?: number;
  servico_id?: number | null;
  status_participacao_id?: number;
}

export interface UpdateParticipacaoInput {
  servico_id?: number | null;
  status_participacao_id?: number;
}

export const listParticipacoes = (filtros: ParticipacaoFiltros): Promise<ListResult<Participacoes>> => {
  const where: Record<string, unknown> = {};
  if (filtros.usuario_id) where.usuario_id = filtros.usuario_id;
  if (filtros.projeto_id) where.projeto_id = filtros.projeto_id;
  if (filtros.status_participacao_id) where.status_participacao_id = filtros.status_participacao_id;

  return listPaginated(Participacoes, {
    page: filtros.page,
    limit: filtros.limit,
    where,
    include: INCLUDES_PADRAO,
    order: [['data_inscricao', 'DESC']]
  });
};

export const getParticipacaoById = async (id: string, usuarioAutenticadoId: number): Promise<Participacoes> => {
  const participacao = await findByIdOrFail(Participacoes, id, INCLUDES_PADRAO, 'Participação não encontrada');

  if (participacao.usuario_id !== usuarioAutenticadoId) {
    throw new AuthorizationError('Você não tem permissão para visualizar este recurso');
  }

  return participacao;
};

/**
 * Garante a existência da campanha e que ela ainda está ativa antes de
 * permitir a inscrição (RF07 + regra de negócio documentada nos diagramas
 * de atividade/sequência do projeto, que não estava implementada nas rotas
 * originais em JavaScript).
 */
const validarCampanhaParaParticipacao = async (projetoId: number): Promise<Projeto> => {
  const projeto = await Projeto.findByPk(projetoId);

  if (!projeto) {
    throw new NotFoundError('Campanha não encontrada');
  }

  if (projeto.status_id !== STATUS_CAMPANHA_ATIVA) {
    throw new BusinessRuleError('Não é possível registrar participação em uma campanha encerrada');
  }

  return projeto;
};

export const createParticipacao = async (
  input: CreateParticipacaoInput,
  usuarioAutenticadoId: number
): Promise<Participacoes> => {
  const errors: ErrorDetail[] = [];
  if (!input.usuario_id) errors.push({ field: 'usuario_id', message: 'usuario_id é obrigatório' });
  if (!input.projeto_id) errors.push({ field: 'projeto_id', message: 'projeto_id é obrigatório' });
  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  if (Number(input.usuario_id) !== usuarioAutenticadoId) {
    throw new AuthorizationError('Você não pode realizar uma inscrição em nome de outra conta');
  }

  await validarCampanhaParaParticipacao(input.projeto_id!);

  const participacao = await Participacoes.create({
    usuario_id: input.usuario_id!,
    projeto_id: input.projeto_id!,
    servico_id: input.servico_id ?? null,
    status_participacao_id: input.status_participacao_id ?? STATUS_PARTICIPACAO_PADRAO
  });

  return findByIdOrFail(Participacoes, participacao.id, INCLUDES_PADRAO);
};

export const updateParticipacao = async (
  id: string,
  input: UpdateParticipacaoInput,
  usuarioAutenticadoId: number
): Promise<Participacoes> => {
  const participacao = await Participacoes.findByPk(id);
  if (!participacao) {
    throw new NotFoundError('Participação não encontrada');
  }

  if (participacao.usuario_id !== usuarioAutenticadoId) {
    throw new AuthorizationError('Você não tem permissão para editar esta participação');
  }

  if (input.servico_id !== undefined) participacao.servico_id = input.servico_id ?? null;
  if (input.status_participacao_id) participacao.status_participacao_id = input.status_participacao_id;

  await participacao.save();

  return findByIdOrFail(Participacoes, id, INCLUDES_PADRAO);
};

export const deleteParticipacao = async (id: string, usuarioAutenticadoId: number): Promise<void> => {
  const participacao = await Participacoes.findByPk(id);
  if (!participacao) {
    throw new NotFoundError('Participação não encontrada');
  }

  if (participacao.usuario_id !== usuarioAutenticadoId) {
    throw new AuthorizationError('Você não tem permissão para deletar esta participação');
  }

  await participacao.destroy();
};

export const listParticipacoesDoUsuario = (
  usuarioId: string,
  page?: unknown,
  limit?: unknown
): Promise<ListResult<Participacoes>> =>
  listPaginated(Participacoes, {
    page,
    limit,
    where: { usuario_id: usuarioId },
    include: [
      {
        model: Projeto,
        as: 'projeto',
        attributes: ['id', 'titulo', 'descricao', 'data_criacao', 'data_inicio', 'data_fim', 'meta_participantes'],
        include: [
          { model: Categoria, as: 'categoria', attributes: ['id', 'nome'] },
          { model: Usuario, as: 'criador', attributes: ['id', 'nome'] },
          { model: StatusCampanha, as: 'status', attributes: ['id', 'nome'] }
        ]
      },
      { model: StatusParticipacao, as: 'status', attributes: ['id', 'nome'] }
    ],
    order: [['data_inscricao', 'DESC']]
  });

export const verificarInscricaoExistente = async (
  usuarioId: string,
  projetoId: string
): Promise<{ existe: boolean; detalhes: Participacoes | null }> => {
  const participacao = await Participacoes.findOne({
    where: { usuario_id: usuarioId, projeto_id: projetoId },
    include: [{ model: StatusParticipacao, as: 'status', attributes: ['id', 'nome'] }]
  });

  return { existe: !!participacao, detalhes: participacao };
};
