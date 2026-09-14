import { NextFunction, Request, Response } from 'express';
import * as dashboardService from '../services/dashboardService';

export const getStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stats = await dashboardService.getStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};
