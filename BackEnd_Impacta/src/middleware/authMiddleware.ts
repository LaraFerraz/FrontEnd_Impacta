import { NextFunction, Request, Response } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt';

/**
 * Exige um Bearer token válido. Popula req.usuario com o payload decodificado.
 */
export const autenticar = (req: Request, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    req.usuario = verifyToken(token);
    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ message: 'Token expirado' });
    }
    return res.status(401).json({ message: 'Token inválido' });
  }
};

/**
 * Garante que o :id da rota corresponde ao usuário autenticado.
 * Reutilizado por qualquer rota "dono do recurso" (perfil, participações, etc.),
 * eliminando a duplicação manual dessa checagem que existia em várias rotas
 * do projeto original.
 */
export const autorizarProprio = (req: Request, res: Response, next: NextFunction): Response | void => {
  const userId = req.usuario?.id;
  const paramId = req.params?.id;

  if (!userId || !paramId || String(userId) !== String(paramId)) {
    return res.status(403).json({
      message: 'Acesso negado: Você não tem permissão para alterar ou acessar este recurso',
      code: 'AUTHORIZATION_ERROR'
    });
  }

  return next();
};

/**
 * Igual a `autenticar`, mas nunca bloqueia a requisição: se houver um token
 * válido, popula req.usuario; caso contrário (sem token ou token inválido),
 * segue em frente como visitante anônimo. Usado em rotas públicas que
 * precisam de um comportamento diferente para quem está logado (ex: listar
 * campanhas mostrando também as pendentes do próprio usuário ou do admin).
 */
export const autenticarOpcional = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.usuario = verifyToken(token);
    } catch {
      // Token ausente/inválido: segue como anônimo, sem lançar erro.
    }
  }

  next();
};

/**
 * Exige que o usuário autenticado seja do tipo Admin (tipo_usuario_id = 1).
 * Usado nas rotas de moderação: aprovar campanhas, gerenciar categorias e
 * outras tabelas de referência, e ações administrativas sobre usuários.
 */
export const ehAdmin = (req: Request, res: Response, next: NextFunction): Response | void => {
  if (req.usuario?.tipo !== 1) {
    return res.status(403).json({
      message: 'Acesso restrito a administradores',
      code: 'AUTHORIZATION_ERROR'
    });
  }

  return next();
};

/**
 * Como autorizarProprio, mas também libera o acesso se o usuário autenticado
 * for admin — usado em rotas onde o dono do recurso pode agir sobre si
 * mesmo, e um admin pode agir sobre qualquer um (ex: excluir uma conta).
 */
export const autorizarProprioOuAdmin = (req: Request, res: Response, next: NextFunction): Response | void => {
  if (req.usuario?.tipo === 1) {
    return next();
  }
  return autorizarProprio(req, res, next);
};

/**
 * Variante de autorizarProprio para rotas onde o ID do dono vem do BODY
 * (ex: POST /favoritos com usuario_id no corpo) em vez dos params da URL.
 */
export const autorizarProprioNoBody =
  (campo: string) =>
  (req: Request, res: Response, next: NextFunction): Response | void => {
    const userId = req.usuario?.id;
    const bodyId = req.body?.[campo];

    if (!userId || bodyId === undefined || Number(bodyId) !== userId) {
      return res.status(403).json({
        message: 'Acesso negado: Você não tem permissão para esta operação',
        code: 'AUTHORIZATION_ERROR'
      });
    }

    return next();
  };
