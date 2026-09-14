import { InfoCampanha, Projeto } from '../models';
import { NotFoundError, ValidationError } from '../utils/errors';
import { findByIdOrFail, listPaginated, ListResult } from '../utils/crudHelpers';

const INCLUDES = [{ model: Projeto, as: 'projeto' as const, attributes: ['id', 'titulo'] }];

export interface InfoCampanhaInput {
  projeto_id?: number;
  objetivos?: string;
  publico_alvo?: string;
  impacto_esperado?: string;
  regras?: string;
  observacoes?: string;
}

const sanitize = (value: string | undefined): string | null => (value?.trim() ? value.trim() : null);

export const listInfoCampanhas = (
  projetoId: unknown,
  page?: unknown,
  limit?: unknown
): Promise<ListResult<InfoCampanha>> =>
  listPaginated(InfoCampanha, {
    page,
    limit,
    where: projetoId ? { projeto_id: projetoId } : undefined,
    include: INCLUDES
  });

export const getInfoCampanhaById = (id: string): Promise<InfoCampanha> =>
  findByIdOrFail(InfoCampanha, id, INCLUDES, 'Informações de campanha não encontradas');

export const createInfoCampanha = async (input: InfoCampanhaInput): Promise<InfoCampanha> => {
  if (!input.projeto_id) {
    throw new ValidationError([{ field: 'projeto_id', message: 'O campo projeto_id é obrigatório' }]);
  }

  const infoCampanha = await InfoCampanha.create({
    projeto_id: input.projeto_id,
    objetivos: sanitize(input.objetivos),
    publico_alvo: sanitize(input.publico_alvo),
    impacto_esperado: sanitize(input.impacto_esperado),
    regras: sanitize(input.regras),
    observacoes: sanitize(input.observacoes)
  });

  return findByIdOrFail(InfoCampanha, infoCampanha.id, INCLUDES);
};

export const updateInfoCampanha = async (id: string, input: InfoCampanhaInput): Promise<InfoCampanha> => {
  const infoCampanha = await InfoCampanha.findByPk(id);
  if (!infoCampanha) {
    throw new NotFoundError('Informações de campanha não encontradas');
  }

  if (input.objetivos !== undefined) infoCampanha.objetivos = sanitize(input.objetivos);
  if (input.publico_alvo !== undefined) infoCampanha.publico_alvo = sanitize(input.publico_alvo);
  if (input.impacto_esperado !== undefined) infoCampanha.impacto_esperado = sanitize(input.impacto_esperado);
  if (input.regras !== undefined) infoCampanha.regras = sanitize(input.regras);
  if (input.observacoes !== undefined) infoCampanha.observacoes = sanitize(input.observacoes);

  await infoCampanha.save();

  return findByIdOrFail(InfoCampanha, id, INCLUDES);
};

export const deleteInfoCampanha = async (id: string): Promise<void> => {
  const infoCampanha = await InfoCampanha.findByPk(id);
  if (!infoCampanha) {
    throw new NotFoundError('Informações de campanha não encontradas');
  }
  await infoCampanha.destroy();
};
