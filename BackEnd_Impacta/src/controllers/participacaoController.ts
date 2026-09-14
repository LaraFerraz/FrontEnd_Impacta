import { NextFunction, Request, Response } from 'express';
import * as participacaoService from '../services/participacaoService';

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows, pagination } = await participacaoService.listParticipacoes(req.query);
    res.json({ data: rows, pagination });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const participacao = await participacaoService.getParticipacaoById(String(req.params.id), req.usuario!.id);
    res.json({ data: participacao });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const participacao = await participacaoService.createParticipacao(req.body, req.usuario!.id);
    res.status(201).json({
      message: 'Inscrição realizada com sucesso! Sua participação está pendente de confirmação.',
      data: participacao
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const participacao = await participacaoService.updateParticipacao(String(req.params.id), req.body, req.usuario!.id);
    res.json({ message: 'Participação atualizada com sucesso', data: participacao });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await participacaoService.deleteParticipacao(String(req.params.id), req.usuario!.id);
    res.json({ message: 'Participação deletada com sucesso' });
  } catch (error) {
    next(error);
  }
};

export const listPorUsuario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (Number(req.params.usuario_id) !== req.usuario!.id) {
      res.status(403).json({
        message: 'Acesso negado',
        code: 'AUTHORIZATION_ERROR',
        errors: [{ message: 'Você não tem permissão para visualizar o histórico deste usuário' }]
      });
      return;
    }

    const { rows, pagination } = await participacaoService.listParticipacoesDoUsuario(
      String(req.params.usuario_id),
      req.query.page,
      req.query.limit
    );
    res.json({ data: rows, pagination });
  } catch (error) {
    next(error);
  }
};

export const verificarExistente = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (Number(req.params.usuario_id) !== req.usuario!.id) {
      res.status(403).json({
        message: 'Acesso negado',
        code: 'AUTHORIZATION_ERROR',
        errors: [{ message: 'Você não possui permissão para consultar os dados deste usuário' }]
      });
      return;
    }

    const resultado = await participacaoService.verificarInscricaoExistente(
      String(req.params.usuario_id),
      String(req.params.projeto_id)
    );
    res.json({ data: resultado });
  } catch (error) {
    next(error);
  }
};
