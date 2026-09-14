import { NextFunction, Request, Response } from 'express';
import * as preferenciaService from '../services/preferenciaService';

export const listPorUsuario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const resultado = await preferenciaService.listPreferenciasDoUsuario(String(req.params.usuario_id), req.usuario!.id);
    res.json(resultado);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const preferencia = await preferenciaService.getPreferenciaById(String(req.params.id), req.usuario!.id);
    res.json({ data: preferencia });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const preferencia = await preferenciaService.createPreferencia(
      req.body.usuario_id,
      req.body.categoria_id,
      req.usuario!.id
    );
    res.status(201).json({ message: 'Preferência adicionada com sucesso', data: preferencia });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await preferenciaService.deletePreferencia(String(req.params.id), req.usuario!.id);
    res.json({ message: 'Preferência removida com sucesso' });
  } catch (error) {
    next(error);
  }
};
