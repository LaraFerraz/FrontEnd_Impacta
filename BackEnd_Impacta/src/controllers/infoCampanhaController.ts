import { NextFunction, Request, Response } from 'express';
import * as infoCampanhaService from '../services/infoCampanhaService';

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows, pagination } = await infoCampanhaService.listInfoCampanhas(
      req.query.projeto_id,
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
    const infoCampanha = await infoCampanhaService.getInfoCampanhaById(String(req.params.id));
    res.json({ data: infoCampanha });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const infoCampanha = await infoCampanhaService.createInfoCampanha(req.body);
    res.status(201).json({ message: 'Informações de campanha criadas com sucesso', data: infoCampanha });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const infoCampanha = await infoCampanhaService.updateInfoCampanha(String(req.params.id), req.body);
    res.json({ message: 'Informações de campanha atualizadas com sucesso', data: infoCampanha });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await infoCampanhaService.deleteInfoCampanha(String(req.params.id));
    res.json({ message: 'Informações de campanha deletadas com sucesso' });
  } catch (error) {
    next(error);
  }
};
