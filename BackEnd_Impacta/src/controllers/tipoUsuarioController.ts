import { NextFunction, Request, Response } from 'express';
import * as tipoUsuarioService from '../services/tipoUsuarioService';

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows, pagination } = await tipoUsuarioService.listTiposUsuario(req.query.page, req.query.limit);
    res.json({ data: rows, pagination });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tipo = await tipoUsuarioService.getTipoUsuarioById(String(req.params.id));
    res.json({ data: tipo });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tipo = await tipoUsuarioService.createTipoUsuario(req.body.nome);
    res.status(201).json({ message: 'Tipo de usuário criado com sucesso', data: tipo });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tipo = await tipoUsuarioService.updateTipoUsuario(String(req.params.id), req.body.nome);
    res.json({ message: 'Tipo de usuário atualizado com sucesso', data: tipo });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await tipoUsuarioService.deleteTipoUsuario(String(req.params.id));
    res.json({ message: 'Tipo de usuário deletado com sucesso' });
  } catch (error) {
    next(error);
  }
};
