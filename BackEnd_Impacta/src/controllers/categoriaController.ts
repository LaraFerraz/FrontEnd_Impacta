import { NextFunction, Request, Response } from 'express';
import * as categoriaService from '../services/categoriaService';

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows, pagination } = await categoriaService.listCategorias(req.query.page, req.query.limit);
    res.json({ data: rows, pagination });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categoria = await categoriaService.getCategoriaById(String(req.params.id));
    res.json({ data: categoria });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categoria = await categoriaService.createCategoria(req.body.nome);
    res.status(201).json({ message: 'Categoria criada com sucesso', data: categoria });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categoria = await categoriaService.updateCategoria(String(req.params.id), req.body.nome);
    res.json({ message: 'Categoria atualizada com sucesso', data: categoria });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await categoriaService.deleteCategoria(String(req.params.id));
    res.json({ message: 'Categoria deletada com sucesso' });
  } catch (error) {
    next(error);
  }
};
