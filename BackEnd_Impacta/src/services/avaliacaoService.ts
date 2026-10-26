import { Avaliacoes, Usuario, Projeto } from '../models';
import { ErrorDetail, NotFoundError, ValidationError } from '../utils/errors';
import { findByIdOrFail, listPaginated, ListResult } from '../utils/crudHelpers';

const INCLUDES = [
  { model: Usuario, as: 'usuario' as const, attributes: ['id', 'nome', 'email'] },
  { model: Projeto, as: 'projeto' as const, attributes: ['id', 'titulo'] }
];

const validarNota = (nota: unknown): ErrorDetail[] => {
  const errors: ErrorDetail[] = [];
  if (nota === undefined || nota === null) {
    errors.push({ field: 'nota', message: 'nota é obrigatória' });
  } else if (Number(nota) < 1 || Number(nota) > 5) {
    errors.push({ field: 'nota', message: 'Nota deve estar entre 1 e 5' });
  }
  return errors;
};

export interface AvaliacaoFiltros {
  usuario_id?: unknown;
  projeto_id?: unknown;
  page?: unknown;
  limit?: unknown;
}

export const listAvaliacoes = (filtros: AvaliacaoFiltros): Promise<ListResult<Avaliacoes>> => {
  const where: Record<string, unknown> = {};
  if (filtros.usuario_id) where.usuario_id = filtros.usuario_id;
  if (filtros.projeto_id) where.projeto_id = filtros.projeto_id;

  return listPaginated(Avaliacoes, {
    page: filtros.page,
    limit: filtros.limit,
    where,
    include: INCLUDES,
    order: [['data_avaliacao', 'DESC']]
  });
};

export const getAvaliacaoById = (id: string): Promise<Avaliacoes> =>
  findByIdOrFail(Avaliacoes, id, INCLUDES, 'Avaliação não encontrada');

export const upsertAvaliacao = async (
  usuario_id: number | undefined,
  projeto_id: number | undefined,
  nota: number | undefined
): Promise<Avaliacoes> => {
  const errors: ErrorDetail[] = [];
  if (!usuario_id) errors.push({ field: 'usuario_id', message: 'usuario_id é obrigatório' });
  if (!projeto_id) errors.push({ field: 'projeto_id', message: 'projeto_id é obrigatório' });
  errors.push(...validarNota(nota));

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  let avaliacao = await Avaliacoes.findOne({ where: { usuario_id, projeto_id } });

  if (avaliacao) {
    avaliacao.nota = nota!;
    await avaliacao.save();
  } else {
    avaliacao = await Avaliacoes.create({ usuario_id: usuario_id!, projeto_id: projeto_id!, nota: nota! });
  }

  return findByIdOrFail(Avaliacoes, avaliacao.id, INCLUDES);
};

export const updateAvaliacao = async (id: string, nota: number | undefined): Promise<Avaliacoes> => {
  const avaliacao = await Avaliacoes.findByPk(id);
  if (!avaliacao) {
    throw new NotFoundError('Avaliação não encontrada');
  }

  if (nota !== undefined) {
    const errors = validarNota(nota);
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }
    avaliacao.nota = nota;
    await avaliacao.save();
  }

  return findByIdOrFail(Avaliacoes, id, INCLUDES);
};

export const deleteAvaliacao = async (id: string): Promise<void> => {
  const avaliacao = await Avaliacoes.findByPk(id);
  if (!avaliacao) {
    throw new NotFoundError('Avaliação não encontrada');
  }
  await avaliacao.destroy();
};
