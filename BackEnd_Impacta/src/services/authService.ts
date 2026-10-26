import bcrypt from 'bcryptjs';
import { Usuario, Cidade, TipoUsuario } from '../models';
import { AuthenticationError } from '../utils/errors';
import { signToken, verifyToken } from '../utils/jwt';

export interface RegisterInput {
  nome: string;
  email: string;
  password: string;
  telefone: string;
  cidade?: string;
  cpf: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

const INCLUDE_RELACOES = [
  { model: Cidade, as: 'cidade' as const },
  { model: TipoUsuario, as: 'tipo' as const }
];

const buscarCidadeId = async (nomeCidade?: string): Promise<number | null> => {
  if (!nomeCidade?.trim()) return null;
  const cidade = await Cidade.findOne({ where: { nome: nomeCidade.trim() } });
  return cidade?.id ?? null;
};

const gerarToken = (usuario: Usuario): string =>
  signToken({ id: usuario.id, email: usuario.email, nome: usuario.nome, tipo: usuario.tipo_usuario_id });

export const register = async (input: RegisterInput): Promise<{ token: string; usuario: Usuario }> => {
  const senhaHash = await bcrypt.hash(input.password, 10);
  const cidade_id = await buscarCidadeId(input.cidade);

  const novoUsuario = await Usuario.create({
    nome: input.nome.trim(),
    email: input.email.toLowerCase().trim(),
    senha: senhaHash,
    telefone: input.telefone.trim(),
    cidade_id,
    tipo_usuario_id: 2, // Cliente por padrão
    cpf: input.cpf.trim()
  });

  const usuarioCompleto = await Usuario.findByPk(novoUsuario.id, { include: INCLUDE_RELACOES });
  if (!usuarioCompleto) {
    throw new Error('Falha inesperada ao carregar o usuário recém-criado');
  }

  return { token: gerarToken(usuarioCompleto), usuario: usuarioCompleto };
};

export const login = async (input: LoginInput): Promise<{ token: string; usuario: Usuario }> => {
  const usuario = await Usuario.findOne({
    where: { email: input.email.toLowerCase().trim() },
    include: INCLUDE_RELACOES
  });

  if (!usuario) {
    throw new AuthenticationError('Email ou senha inválidos');
  }

  const senhaValida = await bcrypt.compare(input.password, usuario.senha);
  if (!senhaValida) {
    throw new AuthenticationError('Email ou senha inválidos');
  }

  return { token: gerarToken(usuario), usuario };
};

export const verify = async (token: string): Promise<Usuario> => {
  const decoded = verifyToken(token);
  const usuario = await Usuario.findByPk(decoded.id, { include: INCLUDE_RELACOES });

  if (!usuario) {
    throw new AuthenticationError('Token inválido');
  }

  return usuario;
};
