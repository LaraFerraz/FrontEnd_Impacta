import { Cidade, Estado, Usuario, Projeto } from '../models';
import { ConflictError, ErrorDetail, NotFoundError, ValidationError } from '../utils/errors';
import { findByIdOrFail, listPaginated, ListResult } from '../utils/crudHelpers';

const INCLUDES = [{ model: Estado, as: 'estado' as const, attributes: ['id', 'nome', 'sigla'] }];

export interface CidadeInput {
  nome?: string;
  estado_id?: number;
}

export const listCidades = (page?: unknown, limit?: unknown): Promise<ListResult<Cidade>> =>
  listPaginated(Cidade, { page, limit, include: INCLUDES, order: [['nome', 'ASC']] });

export const listCidadesPorEstado = (estadoId: string): Promise<Cidade[]> =>
  Cidade.findAll({
    attributes: ['id', 'nome', 'estado_id'],
    where: { estado_id: estadoId },
    order: [['nome', 'ASC']]
  });

export const getCidadeById = (id: string): Promise<Cidade> =>
  findByIdOrFail(Cidade, id, INCLUDES, 'Cidade não encontrada');

export const createCidade = (input: CidadeInput): Promise<Cidade> => {
  const errors: ErrorDetail[] = [];
  if (!input.nome?.trim()) errors.push({ field: 'nome', message: 'Nome é obrigatório' });
  if (!input.estado_id) errors.push({ field: 'estado_id', message: 'Estado é obrigatório' });

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  return Cidade.create({ nome: input.nome!.trim(), estado_id: input.estado_id! });
};

export const updateCidade = async (id: string, input: CidadeInput): Promise<Cidade> => {
  const cidade = await Cidade.findByPk(id);
  if (!cidade) {
    throw new NotFoundError('Cidade não encontrada');
  }

  await cidade.update({
    nome: input.nome?.trim() ? input.nome.trim() : cidade.nome,
    estado_id: input.estado_id ?? cidade.estado_id
  });

  return cidade;
};

export const deleteCidade = async (id: string): Promise<void> => {
  const cidade = await Cidade.findByPk(id);
  if (!cidade) {
    throw new NotFoundError('Cidade não encontrada');
  }

  const [usuariosCount, projetosCount] = await Promise.all([
    Usuario.count({ where: { cidade_id: id } }),
    Projeto.count({ where: { cidade_id: id } })
  ]);

  if (usuariosCount > 0 || projetosCount > 0) {
    throw new ConflictError('Não é possível deletar uma cidade com usuários ou projetos associados');
  }

  await cidade.destroy();
};
