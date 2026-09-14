import { Model, ModelStatic } from 'sequelize';
import { ConflictError, NotFoundError, ValidationError } from './errors';
import { findByIdOrFail, listPaginated, ListResult } from './crudHelpers';

interface NomeAttributes {
  id: number;
  nome: string;
}

interface DependencyCheck {
  count: () => Promise<number>;
  message: string;
}

/**
 * Gera um conjunto padrão de operações CRUD para entidades de apoio
 * simples no formato { id, nome } (Status_campanha, Status_participacao,
 * Status_servico). Evita reescrever a mesma lógica de service três vezes
 * para tabelas estruturalmente idênticas.
 */
export const createSimpleLookupService = <M extends Model & NomeAttributes>(
  model: ModelStatic<M>,
  entityLabel: string,
  getDependencyCheck?: (id: string) => DependencyCheck
) => ({
  list: (page?: unknown, limit?: unknown): Promise<ListResult<M>> =>
    listPaginated(model, { page, limit, order: [['nome', 'ASC']] }),

  getById: (id: string): Promise<M> =>
    findByIdOrFail(model, id, undefined, `${entityLabel} não encontrado(a)`),

  create: (nome: string | undefined): Promise<M> => {
    if (!nome?.trim()) {
      throw new ValidationError([{ field: 'nome', message: 'Nome é obrigatório' }]);
    }
    return model.create({ nome: nome.trim() } as never);
  },

  update: async (id: string, nome: string | undefined): Promise<M> => {
    const record = await model.findByPk(id);
    if (!record) {
      throw new NotFoundError(`${entityLabel} não encontrado(a)`);
    }
    if (nome?.trim()) {
      await record.update({ nome: nome.trim() } as never);
    }
    return record;
  },

  delete: async (id: string): Promise<void> => {
    const record = await model.findByPk(id);
    if (!record) {
      throw new NotFoundError(`${entityLabel} não encontrado(a)`);
    }

    if (getDependencyCheck) {
      const { count, message } = getDependencyCheck(id);
      const dependentsCount = await count();
      if (dependentsCount > 0) {
        throw new ConflictError(message);
      }
    }

    await record.destroy();
  }
});
