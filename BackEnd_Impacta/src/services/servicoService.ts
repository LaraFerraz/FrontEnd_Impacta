import { ServicosDisponiveis, Projeto, StatusServico } from '../models';
import { AuthorizationError, ErrorDetail, NotFoundError, ValidationError } from '../utils/errors';
import { findByIdOrFail, listPaginated, ListResult } from '../utils/crudHelpers';
import { STATUS_CAMPANHA_ATIVA } from '../utils/businessConstants';

const INCLUDES = [
  { model: Projeto, as: 'projeto' as const, attributes: ['id', 'titulo', 'status_id'] },
  { model: StatusServico, as: 'status' as const, attributes: ['id', 'nome'] }
];

export interface ServicoFiltros {
  projeto_id?: unknown;
  status_servico_id?: unknown;
  page?: unknown;
  limit?: unknown;
}

export interface ServicoInput {
  projeto_id?: number;
  nome_servico?: string;
  descricao?: string;
  quantidade_necessaria?: number;
  status_servico_id?: number;
  campanha_ativa?: boolean;
}

export const listServicos = (filtros: ServicoFiltros): Promise<ListResult<ServicosDisponiveis>> => {
  const where: Record<string, unknown> = {};
  if (filtros.projeto_id) where.projeto_id = filtros.projeto_id;
  if (filtros.status_servico_id) where.status_servico_id = filtros.status_servico_id;

  return listPaginated(ServicosDisponiveis, {
    page: filtros.page,
    limit: filtros.limit,
    where,
    include: INCLUDES,
    order: [['id', 'DESC']]
  });
};

export const listServicosPorStatusCampanha = (
  campanhaAtivaParam: string,
  projetoId: unknown,
  page?: unknown,
  limit?: unknown
): Promise<{ result: ListResult<ServicosDisponiveis>; campanha_ativa: boolean }> => {
  const campanha_ativa = campanhaAtivaParam === 'true' || campanhaAtivaParam === '1';
  const where: Record<string, unknown> = { campanha_ativa };
  if (projetoId) where.projeto_id = projetoId;

  return listPaginated(ServicosDisponiveis, {
    page,
    limit,
    where,
    include: INCLUDES,
    order: [['id', 'DESC']]
  }).then((result) => ({ result, campanha_ativa }));
};

export const getServicoById = (id: string): Promise<ServicosDisponiveis> =>
  findByIdOrFail(ServicosDisponiveis, id, INCLUDES, 'Serviço não encontrado');

export const createServico = async (
  input: ServicoInput,
  usuarioAutenticadoId: number
): Promise<ServicosDisponiveis> => {
  const errors: ErrorDetail[] = [];
  if (!input.projeto_id) errors.push({ field: 'projeto_id', message: 'projeto_id é obrigatório' });
  if (!input.nome_servico?.trim()) errors.push({ field: 'nome_servico', message: 'nome_servico é obrigatório' });
  if (!input.status_servico_id) errors.push({ field: 'status_servico_id', message: 'status_servico_id é obrigatório' });

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  const projeto = await Projeto.findByPk(input.projeto_id);
  if (!projeto) {
    throw new NotFoundError('Projeto não encontrado');
  }

  if (projeto.criador_id !== usuarioAutenticadoId) {
    throw new AuthorizationError('Você não tem permissão para gerenciar serviços deste projeto');
  }

  const campanha_ativa = projeto.status_id === STATUS_CAMPANHA_ATIVA;

  const servico = await ServicosDisponiveis.create({
    projeto_id: input.projeto_id!,
    nome_servico: input.nome_servico!.trim(),
    descricao: input.descricao?.trim() || null,
    quantidade_necessaria: input.quantidade_necessaria || 1,
    status_servico_id: input.status_servico_id!,
    campanha_ativa
  });

  return findByIdOrFail(ServicosDisponiveis, servico.id, INCLUDES);
};

export const updateServico = async (
  id: string,
  input: ServicoInput,
  usuarioAutenticadoId: number
): Promise<ServicosDisponiveis> => {
  const servico = await ServicosDisponiveis.findByPk(id, { include: [{ model: Projeto, as: 'projeto' }] });
  if (!servico) {
    throw new NotFoundError('Serviço não encontrado');
  }

  const projeto = await Projeto.findByPk(servico.projeto_id);
  if (!projeto || projeto.criador_id !== usuarioAutenticadoId) {
    throw new AuthorizationError('Você não tem permissão para editar este serviço');
  }

  if (input.nome_servico) servico.nome_servico = input.nome_servico.trim();
  if (input.descricao !== undefined) servico.descricao = input.descricao ? input.descricao.trim() : null;
  if (input.quantidade_necessaria !== undefined) servico.quantidade_necessaria = input.quantidade_necessaria;
  if (input.status_servico_id) servico.status_servico_id = input.status_servico_id;
  if (input.campanha_ativa !== undefined) servico.campanha_ativa = input.campanha_ativa;

  await servico.save();

  return findByIdOrFail(ServicosDisponiveis, id, INCLUDES);
};

export const deleteServico = async (id: string, usuarioAutenticadoId: number): Promise<void> => {
  const servico = await ServicosDisponiveis.findByPk(id);
  if (!servico) {
    throw new NotFoundError('Serviço não encontrado');
  }

  const projeto = await Projeto.findByPk(servico.projeto_id);
  if (!projeto || projeto.criador_id !== usuarioAutenticadoId) {
    throw new AuthorizationError('Você não tem permissão para deletar este serviço');
  }

  await servico.destroy();
};

export const sincronizarStatusPorProjeto = async (
  projetoId: string,
  usuarioAutenticadoId: number
): Promise<{ projeto_id: number; campanha_ativa: boolean; servicos_atualizados: number; status_projeto: string }> => {
  const projeto = await Projeto.findByPk(projetoId);
  if (!projeto) {
    throw new NotFoundError('Projeto não encontrado');
  }

  if (projeto.criador_id !== usuarioAutenticadoId) {
    throw new AuthorizationError('Você não tem permissão para alterar os dados deste projeto');
  }

  const campanha_ativa = projeto.status_id === STATUS_CAMPANHA_ATIVA;
  const [updated] = await ServicosDisponiveis.update({ campanha_ativa }, { where: { projeto_id: projetoId } });

  return {
    projeto_id: Number(projetoId),
    campanha_ativa,
    servicos_atualizados: updated,
    status_projeto: campanha_ativa ? 'Ativa' : 'Não Ativa'
  };
};
