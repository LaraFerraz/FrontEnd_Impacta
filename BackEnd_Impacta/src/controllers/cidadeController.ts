import { NextFunction, Request, Response } from 'express';
import * as cidadeService from '../services/cidadeService';

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows, pagination } = await cidadeService.listCidades(req.query.page, req.query.limit);
    res.json({ data: rows, pagination });
  } catch (error) {
    next(error);
  }
};

export const listPorEstado = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cidades = await cidadeService.listCidadesPorEstado(String(req.params.estadoId));
    res.json({ data: cidades, total: cidades.length });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cidade = await cidadeService.getCidadeById(String(req.params.id));
    res.json({ data: cidade });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cidade = await cidadeService.createCidade(req.body);
    res.status(201).json({ message: 'Cidade criada com sucesso', data: cidade });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cidade = await cidadeService.updateCidade(String(req.params.id), req.body);
    res.json({ message: 'Cidade atualizada com sucesso', data: cidade });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await cidadeService.deleteCidade(String(req.params.id));
    res.json({ message: 'Cidade deletada com sucesso' });
  } catch (error) {
    next(error);
  }
};
