import bcrypt from 'bcryptjs';
import { Usuario, Cidade, TipoUsuario } from '../models';
import { NotFoundError, ValidationError } from '../utils/errors';
import { extractPagination, buildPaginationMeta, PaginationMeta } from '../utils/pagination';
import { caminhoPublico, removerArquivoAntigo } from '../middleware/uploadMiddleware';

const ATRIB_PUBLICOS = ['id', 'nome', 'email', 'telefone', 'foto', 'data_criacao'];
const ATRIB_COMPLETOS = ['id', 'nome', 'email', 'cpf', 'telefone', 'foto', 'data_criacao'];

const INCLUDES = [
  { model: Cidade, as: 'cidade' as const, attributes: ['id', 'nome'] },
  { model: TipoUsuario, as: 'tipo' as const, attributes: ['id', 'nome'] }
];

export interface UsuarioUpdateInput {
  nome?: string;
  telefone?: string;
  cpf?: string;
  cidade_id?: number | string;
  password?: string;
}

export const listUsuariosPublico = async (
  pageQuery: unknown
): Promise<{ data: Usuario[]; pagination: PaginationMeta }> => {
  const pagination = extractPagination(pageQuery, undefined, 10);

  const { count, rows } = await Usuario.findAndCountAll({
    attributes: ATRIB_PUBLICOS,
    include: INCLUDES,
    order: [['data_criacao', 'DESC']],
    limit: pagination.limit,
    offset: pagination.offset
  });

  return { data: rows, pagination: buildPaginationMeta(count, pagination) };
};

export const getUsuarioPublicoById = async (id: string): Promise<Usuario> => {
  const usuario = await Usuario.findByPk(id, { attributes: ATRIB_PUBLICOS, include: INCLUDES });
  if (!usuario) {
    throw new NotFoundError('Usuário não encontrado');
  }
  return usuario;
};

export const getUsuarioPerfilCompleto = async (id: string): Promise<Usuario> => {
  const usuario = await Usuario.findByPk(id, { attributes: ATRIB_COMPLETOS, include: INCLUDES });
  if (!usuario) {
    throw new NotFoundError('Usuário não encontrado');
  }
  return usuario;
};

export const updateUsuario = async (id: string, dados: UsuarioUpdateInput): Promise<Usuario> => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) {
    throw new NotFoundError('Usuário não encontrado');
  }

  const atualizacao: Record<string, unknown> = {};
  if (dados.nome) atualizacao.nome = dados.nome.trim();
  if (dados.telefone) atualizacao.telefone = dados.telefone.trim();
  if (dados.cpf) atualizacao.cpf = dados.cpf.replace(/\D/g, '');
  if (dados.cidade_id) atualizacao.cidade_id = Number(dados.cidade_id);
  if (dados.password?.trim()) {
    atualizacao.senha = await bcrypt.hash(dados.password, 10);
  }

  await usuario.update(atualizacao);

  return getUsuarioPerfilCompleto(id);
};

/**
 * Troca a foto de perfil, removendo a anterior do disco (se existir) pra
 * não acumular arquivos órfãos. A checagem de "só o dono pode alterar" já
 * é feita na rota, pelo middleware autorizarProprio.
 */
export const atualizarFotoPerfil = async (id: string, nomeArquivo: string): Promise<Usuario> => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) {
    throw new NotFoundError('Usuário não encontrado');
  }

  removerArquivoAntigo(usuario.foto);
  usuario.foto = caminhoPublico('perfis', nomeArquivo);
  await usuario.save();

  return getUsuarioPerfilCompleto(id);
};

/**
 * Altera o tipo (admin/cliente) de um usuário. Rota exclusiva de admin
 * (checagem feita em userRoutes.ts pelo middleware ehAdmin) — é o único
 * caminho funcional para promover alguém a admin dentro da aplicação,
 * já que o cadastro público sempre cria tipo_usuario_id = 2 (Cliente).
 *
 * Regra de negócio: um admin não pode remover o próprio privilégio de
 * admin (evita o cenário de o último admin se rebaixar e ninguém mais
 * conseguir gerenciar tipos de usuário).
 */
export const updateTipoUsuario = async (
  id: string,
  tipoUsuarioId: unknown,
  idUsuarioLogado: number
): Promise<Usuario> => {
  const tipoId = Number(tipoUsuarioId);

  if (!tipoUsuarioId || Number.isNaN(tipoId)) {
    throw new ValidationError([{ field: 'tipo_usuario_id', message: 'O campo tipo_usuario_id é obrigatório e deve ser numérico' }]);
  }

  const tipo = await TipoUsuario.findByPk(tipoId);
  if (!tipo) {
    throw new ValidationError([{ field: 'tipo_usuario_id', message: 'Tipo de usuário inexistente' }]);
  }

  const usuario = await Usuario.findByPk(id);
  if (!usuario) {
    throw new NotFoundError('Usuário não encontrado');
  }

  const ADMIN_TIPO_ID = 1;
  if (Number(id) === idUsuarioLogado && usuario.tipo_usuario_id === ADMIN_TIPO_ID && tipoId !== ADMIN_TIPO_ID) {
    throw new ValidationError([{ field: 'tipo_usuario_id', message: 'Você não pode remover seu próprio privilégio de administrador' }]);
  }

  usuario.tipo_usuario_id = tipoId;
  await usuario.save();

  return getUsuarioPerfilCompleto(id);
};

export const deleteUsuario = async (id: string): Promise<void> => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) {
    throw new NotFoundError('Usuário não encontrado');
  }
  await usuario.destroy();
};
