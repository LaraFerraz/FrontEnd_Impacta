import { NextFunction, Request, Response } from 'express';
import * as authService from '../services/authService';

export const registerHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, usuario } = await authService.register(req.body);
    res.status(201).json({ message: 'Usuário criado com sucesso', token, data: usuario });
  } catch (error) {
    next(error);
  }
};

export const loginHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, usuario } = await authService.login(req.body);
    res.json({ message: 'Login realizado com sucesso', token, user: usuario });
  } catch (error) {
    next(error);
  }
};

export const verifyHandler = async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ valid: false, message: 'Token não fornecido' });
    return;
  }

  try {
    const token = authHeader.split(' ')[1];
    const usuario = await authService.verify(token);
    res.json({ valid: true, user: usuario });
  } catch {
    res.status(401).json({ valid: false, message: 'Token inválido ou expirado' });
  }
};
