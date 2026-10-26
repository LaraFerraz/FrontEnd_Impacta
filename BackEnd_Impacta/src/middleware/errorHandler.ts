import { NextFunction, Request, Response } from 'express';
import { MulterError } from 'multer';
import {
  BaseError,
  ValidationError as SequelizeValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError
} from 'sequelize';
import { AppError, ErrorDetail } from '../utils/errors';
import { isProduction } from '../config/env';
import { TAMANHO_MAXIMO_BYTES } from './uploadMiddleware';

interface JsonErrorResponse {
  message: string;
  code: string;
  errors?: ErrorDetail[];
}

const respond = (res: Response, status: number, body: JsonErrorResponse): Response =>
  res.status(status).json(body);

const handleSequelizeValidationError = (error: SequelizeValidationError, res: Response): Response => {
  const errors: ErrorDetail[] = error.errors.map((err) => ({
    field: err.path ?? undefined,
    message: err.message
  }));

  return respond(res, 400, {
    message: 'Erro de validação do banco de dados',
    code: 'SEQUELIZE_VALIDATION_ERROR',
    errors
  });
};

const handleSequelizeUniqueConstraintError = (error: UniqueConstraintError, res: Response): Response => {
  const field = error.fields ? Object.keys(error.fields)[0] : 'campo';
  const mensagemEspecifica = error.errors?.[0]?.message || `${field} já está registrado no sistema`;

  return respond(res, 409, {
    message: mensagemEspecifica,
    code: 'UNIQUE_CONSTRAINT_VIOLATION',
    errors: [{ field, message: mensagemEspecifica }]
  });
};

const handleSequelizeForeignKeyConstraintError = (res: Response): Response =>
  respond(res, 400, {
    message: 'Erro de referência no banco de dados',
    code: 'FOREIGN_KEY_CONSTRAINT_ERROR',
    errors: [{ message: 'Um ou mais registros relacionados não foram encontrados' }]
  });

const handleSequelizeBaseError = (error: BaseError, res: Response): Response =>
  respond(res, 500, {
    message: 'Erro no banco de dados',
    code: 'DATABASE_ERROR',
    errors: [{ message: error.message }]
  });

const handleAppError = (error: AppError, res: Response): Response =>
  respond(res, error.statusCode, {
    message: error.message,
    code: error.code,
    errors: error.errors
  });

/**
 * Middleware centralizado de erro. Deve ser registrado após todas as rotas.
 */
// Os 4 parâmetros são exigidos pela assinatura do Express para reconhecer
// esta função como um error-handling middleware (mesmo sem usar req/next).
export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  // eslint-disable-next-line no-console
  console.error(`[ERROR] ${new Date().toISOString()}`, error);

  if (error instanceof MulterError) {
    const mensagem =
      error.code === 'LIMIT_FILE_SIZE'
        ? `Arquivo muito grande. Tamanho máximo: ${TAMANHO_MAXIMO_BYTES / (1024 * 1024)}MB`
        : 'Erro no upload do arquivo';

    return respond(res, 400, {
      message: mensagem,
      code: 'UPLOAD_ERROR',
      errors: [{ field: 'imagem', message: mensagem }]
    });
  }

  if (error instanceof UniqueConstraintError) {
    return handleSequelizeUniqueConstraintError(error, res);
  }

  if (error instanceof ForeignKeyConstraintError) {
    return handleSequelizeForeignKeyConstraintError(res);
  }

  if (error instanceof SequelizeValidationError) {
    return handleSequelizeValidationError(error, res);
  }

  if (error instanceof BaseError) {
    return handleSequelizeBaseError(error, res);
  }

  if (error instanceof AppError) {
    return handleAppError(error, res);
  }

  const message = error instanceof Error ? error.message : 'Algo deu errado';

  return respond(res, 500, {
    message: 'Erro interno do servidor',
    code: 'INTERNAL_SERVER_ERROR',
    errors: [{ message: isProduction ? 'Algo deu errado' : message }]
  });
};

console.log('>>> errorHandler.ts terminou de carregar, tipo:', typeof errorHandler);