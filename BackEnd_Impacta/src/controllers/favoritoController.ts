import { NextFunction, Request, Response } from 'express';
import * as favoritoService from '../services/favoritoService';

export const listPorUsuario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows, pagination } = await favoritoService.listFavoritosDoUsuario(
      String(req.params.usuario_id),
      req.usuario!.id,
      req.query.page,
      req.query.limit
    );
    res.json({ data: rows, pagination });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const favorito = await favoritoService.getFavoritoById(String(req.params.id), req.usuario!.id);
    res.json({ data: favorito });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const favorito = await favoritoService.createFavorito(req.body.usuario_id, req.body.projeto_id, req.usuario!.id);
    res.status(201).json({ message: 'Projeto adicionado aos favoritos com sucesso', data: favorito });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await favoritoService.deleteFavoritoPorId(String(req.params.id), req.usuario!.id);
    res.json({ message: 'Projeto removido dos favoritos com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const removePorParConta = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await favoritoService.deleteFavoritoPorParConta(String(req.params.usuario_id), String(req.params.projeto_id), req.usuario!.id);
    res.json({ message: 'Projeto removido dos favoritos com sucesso' });
  } catch (error) {
    next(error);
  }
};
