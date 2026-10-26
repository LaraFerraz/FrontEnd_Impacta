import { NextFunction, Request, Response } from 'express';
import * as paisService from '../services/paisService';

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows, pagination } = await paisService.listPaises(req.query.page, req.query.limit);
    res.json({ data: rows, pagination });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pais = await paisService.getPaisById(String(req.params.id));
    res.json({ data: pais });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pais = await paisService.createPais(req.body.nome);
    res.status(201).json({ message: 'País criado com sucesso', data: pais });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pais = await paisService.updatePais(String(req.params.id), req.body.nome);
    res.json({ message: 'País atualizado com sucesso', data: pais });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await paisService.deletePais(String(req.params.id));
    res.json({ message: 'País deletado com sucesso' });
  } catch (error) {
    next(error);
  }
};
