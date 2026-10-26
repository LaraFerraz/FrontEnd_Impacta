import { NextFunction, Request, Response } from 'express';
import { Model } from 'sequelize';
import { ListResult } from './crudHelpers';

interface LookupServiceShape<M extends Model> {
  list: (page?: unknown, limit?: unknown) => Promise<ListResult<M>>;
  getById: (id: string) => Promise<M>;
  create: (nome: string | undefined) => Promise<M>;
  update: (id: string, nome: string | undefined) => Promise<M>;
  delete: (id: string) => Promise<void>;
}

/**
 * Gera as 5 rotas-padrão de controller (list/getById/create/update/remove)
 * para qualquer service produzido por createSimpleLookupService.
 */
export const createSimpleLookupController = <M extends Model>(
  service: LookupServiceShape<M>,
  entityLabel: string
) => ({
  list: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { rows, pagination } = await service.list(req.query.page, req.query.limit);
      res.json({ data: rows, pagination });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const record = await service.getById(String(req.params.id));
      res.json({ data: record });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const record = await service.create(req.body.nome);
      res.status(201).json({ message: `${entityLabel} criado(a) com sucesso`, data: record });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const record = await service.update(String(req.params.id), req.body.nome);
      res.json({ message: `${entityLabel} atualizado(a) com sucesso`, data: record });
    } catch (error) {
      next(error);
    }
  },

  remove: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await service.delete(String(req.params.id));
      res.json({ message: `${entityLabel} deletado(a) com sucesso` });
    } catch (error) {
      next(error);
    }
  }
});
