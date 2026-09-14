import { Preferencias, Usuario, Categoria } from '../models';
import { AuthorizationError, ErrorDetail, NotFoundError, ValidationError } from '../utils/errors';
import { findByIdOrFail } from '../utils/crudHelpers';

const INCLUDES = [
  { model: Usuario, as: 'usuario' as const, attributes: ['id', 'nome', 'email'] },
  { model: Categoria, as: 'categoria' as const, attributes: ['id', 'nome'] }
];

export const listPreferenciasDoUsuario = async (
  usuarioIdParam: string,
  usuarioAutenticadoId: number
): Promise<{ data: Preferencias[]; total: number }> => {
  if (Number(usuarioIdParam) !== usuarioAutenticadoId) {
    throw new AuthorizationError('Você não tem permissão para visualizar as preferências deste usuário');
  }

  const preferencias = await Preferencias.findAll({
    where: { usuario_id: usuarioIdParam },
    include: [{ model: Categoria, as: 'categoria', attributes: ['id', 'nome'] }]
  });

  return { data: preferencias, total: preferencias.length };
};

export const getPreferenciaById = async (id: string, usuarioAutenticadoId: number): Promise<Preferencias> => {
  const preferencia = await findByIdOrFail(Preferencias, id, INCLUDES, 'Preferência não encontrada');

  if (preferencia.usuario_id !== usuarioAutenticadoId) {
    throw new AuthorizationError('Você não tem permissão para acessar este recurso');
  }

  return preferencia;
};

export const createPreferencia = async (
  usuario_id: number | undefined,
  categoria_id: number | undefined,
  usuarioAutenticadoId: number
): Promise<Preferencias> => {
  const errors: ErrorDetail[] = [];
  if (!usuario_id) errors.push({ field: 'usuario_id', message: 'usuario_id é obrigatório' });
  if (!categoria_id) errors.push({ field: 'categoria_id', message: 'categoria_id é obrigatório' });
  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  if (Number(usuario_id) !== usuarioAutenticadoId) {
    throw new AuthorizationError('Você não pode criar preferências para outra conta');
  }

  const preferencia = await Preferencias.create({ usuario_id: usuario_id!, categoria_id: categoria_id! });
  return findByIdOrFail(Preferencias, preferencia.id, INCLUDES);
};

export const deletePreferencia = async (id: string, usuarioAutenticadoId: number): Promise<void> => {
  const preferencia = await Preferencias.findByPk(id);
  if (!preferencia) {
    throw new NotFoundError('Preferência não encontrada');
  }

  if (preferencia.usuario_id !== usuarioAutenticadoId) {
    throw new AuthorizationError('Você não tem permissão para remover esta preferência');
  }

  await preferencia.destroy();
};
