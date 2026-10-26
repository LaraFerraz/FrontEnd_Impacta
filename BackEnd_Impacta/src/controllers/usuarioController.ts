import { NextFunction, Request, Response } from 'express';
import * as usuarioService from '../services/usuarioService';
import { ValidationError } from '../utils/errors';

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const resultado = await usuarioService.listUsuariosPublico(req.query.page);
    res.json(resultado);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const usuario = await usuarioService.getUsuarioPublicoById(String(req.params.id));
    res.json({ data: usuario });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const usuario = await usuarioService.getUsuarioPerfilCompleto(String(req.params.id));
    res.json({ data: usuario });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const usuario = await usuarioService.updateUsuario(String(req.params.id), req.body);
    res.json({ message: 'Perfil atualizado com sucesso', data: usuario });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users/:id/foto — multipart/form-data, campo "foto".
 */
export const uploadFoto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      throw new ValidationError([{ field: 'foto', message: 'Nenhum arquivo enviado' }]);
    }

    const usuario = await usuarioService.atualizarFotoPerfil(String(req.params.id), req.file.filename);
    res.json({ message: 'Foto de perfil atualizada com sucesso', data: usuario });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/users/:id/tipo — exclusiva de admin (ver middleware ehAdmin na rota).
 * Corpo: { tipo_usuario_id: number }
 */
export const updateTipo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const idUsuarioLogado = Number(req.usuario?.id);
    const usuario = await usuarioService.updateTipoUsuario(String(req.params.id), req.body?.tipo_usuario_id, idUsuarioLogado);
    res.json({ message: 'Tipo de usuário atualizado com sucesso', data: usuario });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await usuarioService.deleteUsuario(String(req.params.id));
    res.json({ message: 'Conta excluída com sucesso' });
  } catch (error) {
    next(error);
  }
};
