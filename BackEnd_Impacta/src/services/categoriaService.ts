import { Categoria, Projeto, Preferencias } from '../models';
import { ConflictError, NotFoundError, ValidationError } from '../utils/errors';
import { findByIdOrFail, listPaginated, ListResult } from '../utils/crudHelpers';

export const listCategorias = (page?: unknown, limit?: unknown): Promise<ListResult<Categoria>> =>
  listPaginated(Categoria, { page, limit, order: [['nome', 'ASC']] });

export const getCategoriaById = (id: string): Promise<Categoria> =>
  findByIdOrFail(Categoria, id, undefined, 'Categoria não encontrada');

export const createCategoria = (nome: string | undefined): Promise<Categoria> => {
  if (!nome?.trim()) {
    throw new ValidationError([{ field: 'nome', message: 'Nome é obrigatório' }]);
  }
  return Categoria.create({ nome: nome.trim() });
};

export const updateCategoria = async (id: string, nome: string | undefined): Promise<Categoria> => {
  const categoria = await Categoria.findByPk(id);
  if (!categoria) {
    throw new NotFoundError('Categoria não encontrada');
  }
  if (nome?.trim()) {
    await categoria.update({ nome: nome.trim() });
  }
  return categoria;
};

export const deleteCategoria = async (id: string): Promise<void> => {
  const categoria = await Categoria.findByPk(id);
  if (!categoria) {
    throw new NotFoundError('Categoria não encontrada');
  }

  const [projetosCount, preferenciasCount] = await Promise.all([
    Projeto.count({ where: { categoria_id: id } }),
    Preferencias.count({ where: { categoria_id: id } })
  ]);

  if (projetosCount > 0 || preferenciasCount > 0) {
    throw new ConflictError('Não é possível deletar uma categoria associada a projetos ou preferências');
  }

  await categoria.destroy();
};
