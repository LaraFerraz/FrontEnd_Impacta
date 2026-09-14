import { NextFunction, Request, Response } from 'express';
import * as estadoService from '../services/estadoService';

export const listTodos = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const estados = await estadoService.listTodosEstados();
    res.json({ data: estados, total: estados.length });
  } catch (error) {
    next(error);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows, pagination } = await estadoService.listEstados(req.query.page, req.query.limit);
    res.json({ data: rows, pagination });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const estado = await estadoService.getEstadoById(String(req.params.id));
    res.json({ data: estado });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const estado = await estadoService.createEstado(req.body);
    res.status(201).json({ message: 'Estado criado com sucesso', data: estado });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const estado = await estadoService.updateEstado(String(req.params.id), req.body);
    res.json({ message: 'Estado atualizado com sucesso', data: estado });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await estadoService.deleteEstado(String(req.params.id));
    res.json({ message: 'Estado deletado com sucesso' });
  } catch (error) {
    next(error);
  }
};
