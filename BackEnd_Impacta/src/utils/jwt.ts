import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayload {
  id: number;
  email: string;
  nome: string;
  tipo: number;
}

/**
 * Ponto único de emissão/verificação de tokens.
 * No projeto original, o segredo e a lógica de assinatura estavam
 * duplicados entre authRoutes.js e authMiddleware.js; aqui existe um
 * único lugar para essa responsabilidade.
 */
export const signToken = (payload: JwtPayload): string =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as SignOptions);

export const verifyToken = (token: string): JwtPayload => jwt.verify(token, env.jwtSecret) as JwtPayload;
