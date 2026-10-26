import { NextFunction, Request, Response } from 'express';
import * as servicoService from '../services/servicoService';

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows, pagination } = await servicoService.listServicos(req.query);
    res.json({ data: rows, pagination });
  } catch (error) {
    next(error);
  }
};

export const listPorStatusCampanha = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { result, campanha_ativa } = await servicoService.listServicosPorStatusCampanha(
      String(req.params.campanha_ativa),
      req.query.projeto_id,
      req.query.page,
      req.query.limit
    );
    res.json({
      data: result.rows,
      filter: { campanha_ativa, projeto_id: req.query.projeto_id ? Number(req.query.projeto_id) : null },
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const servico = await servicoService.getServicoById(String(req.params.id));
    res.json({ data: servico });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const servico = await servicoService.createServico(req.body, req.usuario!.id);
    res.status(201).json({ message: 'Serviço criado com sucesso', data: servico });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const servico = await servicoService.updateServico(String(req.params.id), req.body, req.usuario!.id);
    res.json({ message: 'Serviço atualizado com sucesso', data: servico });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await servicoService.deleteServico(String(req.params.id), req.usuario!.id);
    res.json({ message: 'Serviço deletado com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const sincronizarStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const resultado = await servicoService.sincronizarStatusPorProjeto(String(req.params.projeto_id), req.usuario!.id);
    res.json({ message: 'Status sincronizado com sucesso', data: resultado });
  } catch (error) {
    next(error);
  }
};
