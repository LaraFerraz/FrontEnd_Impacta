export interface ErrorDetail {
  field?: string;
  message: string;
}

/**
 * Classe base para todos os erros de aplicação previstos.
 * Cada subtipo carrega seu próprio status HTTP e código de erro,
 * lidos posteriormente pelo errorHandler global.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly errors?: ErrorDetail[];

  constructor(message: string, statusCode: number, code: string, errors?: ErrorDetail[]) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(errors: ErrorDetail[], message = 'Dados inválidos') {
    super(message, 400, 'VALIDATION_ERROR', errors);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso não encontrado') {
    super(message, 404, 'NOT_FOUND_ERROR');
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Não autenticado') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Acesso negado') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflito de dados', errors?: ErrorDetail[]) {
    super(message, 409, 'FOREIGN_KEY_CONSTRAINT_ERROR', errors);
  }
}

export class BusinessRuleError extends AppError {
  constructor(message: string) {
    super(message, 422, 'BUSINESS_RULE_ERROR');
  }
}
