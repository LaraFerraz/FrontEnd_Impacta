import { Pais, Estado } from '../models';
import { ConflictError, NotFoundError, ValidationError } from '../utils/errors';
import { findByIdOrFail, listPaginated, ListResult } from '../utils/crudHelpers';

const INCLUDE_ESTADOS = [{ model: Estado, as: 'estados' as const, attributes: ['id', 'nome', 'sigla'] }];

export const listPaises = (page?: unknown, limit?: unknown): Promise<ListResult<Pais>> =>
  listPaginated(Pais, { page, limit, include: INCLUDE_ESTADOS, order: [['nome', 'ASC']] });

export const getPaisById = (id: string): Promise<Pais> =>
  findByIdOrFail(Pais, id, INCLUDE_ESTADOS, 'País não encontrado');

export const createPais = (nome: string | undefined): Promise<Pais> => {
  if (!nome?.trim()) {
    throw new ValidationError([{ field: 'nome', message: 'Nome do país é obrigatório' }]);
  }
  return Pais.create({ nome: nome.trim() });
};

export const updatePais = async (id: string, nome: string | undefined): Promise<Pais> => {
  if (!nome?.trim()) {
    throw new ValidationError([{ field: 'nome', message: 'Nome do país é obrigatório' }]);
  }

  const pais = await Pais.findByPk(id);
  if (!pais) {
    throw new NotFoundError('País não encontrado');
  }

  await pais.update({ nome: nome.trim() });
  return pais;
};

export const deletePais = async (id: string): Promise<void> => {
  const pais = await Pais.findByPk(id);
  if (!pais) {
    throw new NotFoundError('País não encontrado');
  }

  const estadosCount = await Estado.count({ where: { pais_id: id } });
  if (estadosCount > 0) {
    throw new ConflictError('Não é possível deletar um país com estados associados');
  }

  await pais.destroy();
};
