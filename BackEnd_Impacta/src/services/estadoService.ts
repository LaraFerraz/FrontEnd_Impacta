import { Estado, Pais, Cidade } from '../models';
import { ConflictError, ErrorDetail, NotFoundError, ValidationError } from '../utils/errors';
import { findByIdOrFail, listPaginated, ListResult } from '../utils/crudHelpers';

const ATRIBUTOS = ['id', 'nome', 'sigla', 'pais_id'];
const INCLUDES = [
  { model: Pais, as: 'pais' as const, attributes: ['id', 'nome'] },
  { model: Cidade, as: 'cidades' as const, attributes: ['id', 'nome'] }
];

export interface EstadoInput {
  nome?: string;
  sigla?: string;
  pais_id?: number;
}

export const listTodosEstados = (): Promise<Estado[]> =>
  Estado.findAll({ attributes: ATRIBUTOS, include: INCLUDES, order: [['nome', 'ASC']] });

export const listEstados = (page?: unknown, limit?: unknown): Promise<ListResult<Estado>> =>
  listPaginated(Estado, { page, limit, include: INCLUDES, order: [['nome', 'ASC']] });

export const getEstadoById = (id: string): Promise<Estado> =>
  findByIdOrFail(Estado, id, INCLUDES, 'Estado não encontrado');

export const createEstado = (input: EstadoInput): Promise<Estado> => {
  const errors: ErrorDetail[] = [];
  if (!input.nome?.trim()) errors.push({ field: 'nome', message: 'Nome é obrigatório' });
  if (!input.sigla?.trim()) errors.push({ field: 'sigla', message: 'Sigla é obrigatória' });
  if (!input.pais_id) errors.push({ field: 'pais_id', message: 'País é obrigatório' });

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  return Estado.create({
    nome: input.nome!.trim(),
    sigla: input.sigla!.trim().toUpperCase(),
    pais_id: input.pais_id!
  });
};

export const updateEstado = async (id: string, input: EstadoInput): Promise<Estado> => {
  const estado = await Estado.findByPk(id);
  if (!estado) {
    throw new NotFoundError('Estado não encontrado');
  }

  await estado.update({
    nome: input.nome?.trim() ? input.nome.trim() : estado.nome,
    sigla: input.sigla?.trim() ? input.sigla.trim().toUpperCase() : estado.sigla,
    pais_id: input.pais_id ?? estado.pais_id
  });

  return estado;
};

export const deleteEstado = async (id: string): Promise<void> => {
  const estado = await Estado.findByPk(id);
  if (!estado) {
    throw new NotFoundError('Estado não encontrado');
  }

  const cidadesCount = await Cidade.count({ where: { estado_id: id } });
  if (cidadesCount > 0) {
    throw new ConflictError('Não é possível deletar um estado com cidades associadas');
  }

  await estado.destroy();
};
