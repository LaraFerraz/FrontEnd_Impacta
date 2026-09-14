import { NextFunction, Request, Response } from 'express';
import * as avaliacaoService from '../services/avaliacaoService';

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows, pagination } = await avaliacaoService.listAvaliacoes(req.query);
    res.json({ data: rows, pagination });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const avaliacao = await avaliacaoService.getAvaliacaoById(String(req.params.id));
    res.json({ data: avaliacao });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const avaliacao = await avaliacaoService.upsertAvaliacao(req.body.usuario_id, req.body.projeto_id, req.body.nota);
    res.status(201).json({ message: 'Avaliação registrada com sucesso', data: avaliacao });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const avaliacao = await avaliacaoService.updateAvaliacao(String(req.params.id), req.body.nota);
    res.json({ message: 'Avaliação atualizada com sucesso', data: avaliacao });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await avaliacaoService.deleteAvaliacao(String(req.params.id));
    res.json({ message: 'Avaliação deletada com sucesso' });
  } catch (error) {
    next(error);
  }
};
