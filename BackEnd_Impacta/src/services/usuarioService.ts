import bcrypt from 'bcryptjs';
import { Usuario, Cidade, TipoUsuario } from '../models';
import { NotFoundError } from '../utils/errors';
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

export const deleteUsuario = async (id: string): Promise<void> => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) {
    throw new NotFoundError('Usuário não encontrado');
  }
  await usuario.destroy();
};
