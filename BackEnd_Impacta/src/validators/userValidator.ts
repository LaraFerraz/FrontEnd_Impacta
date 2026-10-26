import { NextFunction, Request, Response } from 'express';
import { ErrorDetail } from '../utils/errors';
import { validateCPF, validateEmail, validatePasswordStrength, validatePhone } from './sharedValidators';

const respondValidationError = (res: Response, errors: ErrorDetail[]): Response =>
  res.status(400).json({ message: 'Dados inválidos', code: 'VALIDATION_ERROR', errors });

export const validarCadastro = (req: Request, res: Response, next: NextFunction): Response | void => {
  const { nome, email, password, cpf, telefone } = req.body as Record<string, string | undefined>;
  const errors: ErrorDetail[] = [];

  if (!nome?.trim()) {
    errors.push({ field: 'nome', message: 'O campo nome é obrigatório' });
  } else {
    const nomeLimpo = nome.trim();
    if (nomeLimpo.length < 2) {
      errors.push({ field: 'nome', message: `Nome muito curto. Mínimo 2 caracteres (você digitou ${nomeLimpo.length})` });
    } else if (nomeLimpo.length > 100) {
      errors.push({ field: 'nome', message: `Nome muito longo. Máximo 100 caracteres (você digitou ${nomeLimpo.length})` });
    }
  }

  if (!email?.trim()) {
    errors.push({ field: 'email', message: 'O campo email é obrigatório' });
  } else if (!validateEmail(email.trim()).valid) {
    errors.push({ field: 'email', message: 'Formato de email inválido. Exemplo esperado: seu.email@dominio.com' });
  }

  if (!cpf?.trim()) {
    errors.push({ field: 'cpf', message: 'O campo CPF é obrigatório' });
  } else {
    const cpfResult = validateCPF(cpf);
    if (!cpfResult.valid) {
      errors.push({ field: 'cpf', message: cpfResult.message ?? 'Número de CPF inválido' });
    }
  }

  if (!telefone?.trim()) {
    errors.push({ field: 'telefone', message: 'O campo telefone é obrigatório' });
  } else if (!validatePhone(telefone).valid) {
    errors.push({ field: 'telefone', message: 'Formato de telefone inválido. Use (11) 99999-9999 ou similar' });
  }

  if (!password?.trim()) {
    errors.push({ field: 'password', message: 'O campo password é obrigatório' });
  } else {
    const forcaSenha = validatePasswordStrength(password);
    if (!forcaSenha.valid) {
      errors.push({
        field: 'password',
        message: forcaSenha.suggestion ?? `Senha fraca (${forcaSenha.strength}). Mínimo: 6 caracteres com letras e números`
      });
    }
  }

  if (errors.length > 0) {
    return respondValidationError(res, errors);
  }

  return next();
};

export const validarLogin = (req: Request, res: Response, next: NextFunction): Response | void => {
  const { email, password } = req.body as Record<string, string | undefined>;
  const errors: ErrorDetail[] = [];

  if (!email?.trim()) {
    errors.push({ field: 'email', message: 'O campo email é obrigatório' });
  } else if (!validateEmail(email.trim()).valid) {
    errors.push({ field: 'email', message: 'Formato de email inválido' });
  }

  if (!password?.trim()) {
    errors.push({ field: 'password', message: 'O campo password é obrigatório' });
  }

  if (errors.length > 0) {
    return respondValidationError(res, errors);
  }

  return next();
};

export const validarAtualizacao = (req: Request, res: Response, next: NextFunction): Response | void => {
  const { nome, telefone, password, cpf, email } = req.body as Record<string, string | undefined>;
  const errors: ErrorDetail[] = [];

  if (email !== undefined) {
    errors.push({ field: 'email', message: 'Por motivos de segurança, o e-mail da conta não pode ser alterado' });
  }

  if (nome !== undefined) {
    if (!nome?.trim()) {
      errors.push({ field: 'nome', message: 'O campo nome não pode estar vazio' });
    } else {
      const nomeLimpo = nome.trim();
      if (nomeLimpo.length < 2) {
        errors.push({ field: 'nome', message: `Nome muito curto. Mínimo 2 caracteres (você digitou ${nomeLimpo.length})` });
      } else if (nomeLimpo.length > 100) {
        errors.push({ field: 'nome', message: `Nome muito longo. Máximo 100 caracteres (você digitou ${nomeLimpo.length})` });
      }
    }
  }

  if (telefone !== undefined) {
    if (!telefone?.trim()) {
      errors.push({ field: 'telefone', message: 'O campo telefone não pode estar vazio' });
    } else if (!validatePhone(telefone).valid) {
      errors.push({ field: 'telefone', message: 'Formato de telefone inválido' });
    }
  }

  if (cpf !== undefined) {
    if (!cpf?.trim()) {
      errors.push({ field: 'cpf', message: 'O campo CPF não pode estar vazio' });
    } else {
      const cpfResult = validateCPF(cpf);
      if (!cpfResult.valid) {
        errors.push({ field: 'cpf', message: cpfResult.message ?? 'Número de CPF inválido' });
      }
    }
  }

  if (password !== undefined && password.trim()) {
    const forcaSenha = validatePasswordStrength(password);
    if (!forcaSenha.valid) {
      errors.push({ field: 'password', message: forcaSenha.suggestion ?? `Senha fraca (${forcaSenha.strength})` });
    }
  }

  if (errors.length > 0) {
    return respondValidationError(res, errors);
  }

  return next();
};
