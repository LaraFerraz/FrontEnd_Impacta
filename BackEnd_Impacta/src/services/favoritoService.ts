import { Favoritos, Usuario, Projeto } from '../models';
import { AuthorizationError, ErrorDetail, NotFoundError, ValidationError } from '../utils/errors';
import { findByIdOrFail, listPaginated, ListResult } from '../utils/crudHelpers';

const INCLUDES = [
  { model: Usuario, as: 'usuario' as const, attributes: ['id', 'nome', 'email'] },
  { model: Projeto, as: 'projeto' as const, attributes: ['id', 'titulo', 'descricao', 'data_criacao'] }
];

export const listFavoritosDoUsuario = (
  usuarioIdParam: string,
  usuarioAutenticadoId: number,
  page?: unknown,
  limit?: unknown
): Promise<ListResult<Favoritos>> => {
  if (Number(usuarioIdParam) !== usuarioAutenticadoId) {
    throw new AuthorizationError('Você não tem permissão para visualizar os favoritos deste usuário');
  }

  return listPaginated(Favoritos, {
    page,
    limit,
    where: { usuario_id: usuarioIdParam },
    include: INCLUDES,
    order: [['id', 'DESC']]
  });
};

export const getFavoritoById = async (id: string, usuarioAutenticadoId: number): Promise<Favoritos> => {
  const favorito = await findByIdOrFail(Favoritos, id, INCLUDES, 'Favorito não encontrado');

  if (favorito.usuario_id !== usuarioAutenticadoId) {
    throw new AuthorizationError('Você não tem permissão para acessar este recurso');
  }

  return favorito;
};

export const createFavorito = async (
  usuario_id: number | undefined,
  projeto_id: number | undefined,
  usuarioAutenticadoId: number
): Promise<Favoritos> => {
  const errors: ErrorDetail[] = [];
  if (!usuario_id) errors.push({ field: 'usuario_id', message: 'usuario_id é obrigatório' });
  if (!projeto_id) errors.push({ field: 'projeto_id', message: 'projeto_id é obrigatório' });
  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  if (Number(usuario_id) !== usuarioAutenticadoId) {
    throw new AuthorizationError('Você não pode criar favoritos para outra conta');
  }

  const favorito = await Favoritos.create({ usuario_id: usuario_id!, projeto_id: projeto_id! });
  return findByIdOrFail(Favoritos, favorito.id, INCLUDES);
};

export const deleteFavoritoPorId = async (id: string, usuarioAutenticadoId: number): Promise<void> => {
  const favorito = await Favoritos.findByPk(id);
  if (!favorito) {
    throw new NotFoundError('Favorito não encontrado');
  }

  if (favorito.usuario_id !== usuarioAutenticadoId) {
    throw new AuthorizationError('Você não tem permissão para remover este favorito');
  }

  await favorito.destroy();
};

export const deleteFavoritoPorParConta = async (
  usuarioIdParam: string,
  projetoIdParam: string,
  usuarioAutenticadoId: number
): Promise<void> => {
  if (Number(usuarioIdParam) !== usuarioAutenticadoId) {
    throw new AuthorizationError('Você não tem permissão para remover este favorito');
  }

  const favorito = await Favoritos.findOne({ where: { usuario_id: usuarioIdParam, projeto_id: projetoIdParam } });
  if (!favorito) {
    throw new NotFoundError('Favorito não encontrado');
  }

  await favorito.destroy();
};
