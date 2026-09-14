import { TipoUsuario, Usuario } from '../models';
import { ConflictError, NotFoundError, ValidationError } from '../utils/errors';
import { findByIdOrFail, listPaginated, ListResult } from '../utils/crudHelpers';

const INCLUDES = [{ model: Usuario, as: 'usuarios' as const, attributes: ['id', 'nome'], required: false }];

export const listTiposUsuario = (page?: unknown, limit?: unknown): Promise<ListResult<TipoUsuario>> =>
  listPaginated(TipoUsuario, { page, limit, include: INCLUDES, order: [['nome', 'ASC']] });

export const getTipoUsuarioById = (id: string): Promise<TipoUsuario> =>
  findByIdOrFail(TipoUsuario, id, INCLUDES, 'Tipo de usuário não encontrado');

export const createTipoUsuario = (nome: string | undefined): Promise<TipoUsuario> => {
  if (!nome?.trim()) {
    throw new ValidationError([{ field: 'nome', message: 'Nome é obrigatório' }]);
  }
  return TipoUsuario.create({ nome: nome.trim() });
};

export const updateTipoUsuario = async (id: string, nome: string | undefined): Promise<TipoUsuario> => {
  const tipo = await TipoUsuario.findByPk(id);
  if (!tipo) {
    throw new NotFoundError('Tipo de usuário não encontrado');
  }
  if (nome?.trim()) {
    await tipo.update({ nome: nome.trim() });
  }
  return tipo;
};

export const deleteTipoUsuario = async (id: string): Promise<void> => {
  const tipo = await TipoUsuario.findByPk(id);
  if (!tipo) {
    throw new NotFoundError('Tipo de usuário não encontrado');
  }

  const usuariosCount = await Usuario.count({ where: { tipo_usuario_id: id } });
  if (usuariosCount > 0) {
    throw new ConflictError('Não é possível deletar um tipo de usuário associado a contas existentes');
  }

  await tipo.destroy();
};
