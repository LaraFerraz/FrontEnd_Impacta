// Importar apenas o que não redefinimos localmente
import {
  validateEmail,
  validatePhone
} from './shared-validators.js';

// Constantes de validação
export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_REGEX = /(?=.*[A-Z])(?=.*\d)/;
export const EMAIL_REGEX = /\S+@\S+\.\S+/;
export const USERNAME_MIN_LENGTH = 3;

// Validadores com contrato esperado pelos testes
export const validateCPF = (cpf) => {
  if (!cpf) return false;
  const nums = cpf.replace(/\D/g, '');
  if (nums.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(nums)) return false;
  return true;
};

export const validatePasswordStrength = (password) => {
  const criteria = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const score = Object.values(criteria).filter(Boolean).length;
  const valida = score >= 3;
  const nivel = score <= 1 ? 'fraca' : score <= 3 ? 'média' : 'forte';
  return { valida, nivel, score };
};

export const formatCPF = (cpf) => {
  const nums = cpf.replace(/\D/g, '');
  return nums.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const validatePassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

export const validateLoginForm = (formData) => {
  const errors = {};
  if (!formData.email) {
    errors.email = 'Email é obrigatório';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Email inválido';
  }
  if (!formData.password) {
    errors.password = 'Senha é obrigatória';
  } else {
    const r = validatePasswordStrength(formData.password);
    if (!r.valida) errors.password = 'Senha insuficientemente forte';
  }
  return errors;
};

export const validateCadastroForm = (formData) => {
  const errors = {};
  if (!formData.nome?.trim()) errors.nome = 'Nome é obrigatório';
  if (!formData.email) {
    errors.email = 'Email é obrigatório';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Email inválido';
  }
  if (!formData.password) {
    errors.password = 'Senha é obrigatória';
  } else {
    const r = validatePasswordStrength(formData.password);
    if (!r.valida) errors.password = 'Senha muito fraca';
  }
  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Confirmação de senha é obrigatória';
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Senhas não coincidem';
  }
  if (!formData.telefone) {
    errors.telefone = 'Telefone é obrigatório';
  } else {
    const r = validatePhone(formData.telefone);
    if (!r.valid) errors.telefone = r.message;
  }
  if (!formData.cidade) errors.cidade = 'Cidade é obrigatória';
  if (!formData.cpf?.trim()) {
    errors.cpf = 'CPF é obrigatório';
  } else if (!validateCPF(formData.cpf)) {
    errors.cpf = 'CPF inválido';
  }
  return errors;
};

export const validateEditarPerfilForm = (formData) => {
  const errors = {};
  if (!formData.nome?.trim()) errors.nome = 'Nome é obrigatório';
  if (formData.password?.trim()) {
    const r = validatePasswordStrength(formData.password);
    if (!r.valida) errors.password = 'Senha muito fraca';
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Senhas não coincidem';
    }
  }
  if (formData.cpf?.trim() && !validateCPF(formData.cpf)) {
    errors.cpf = 'CPF inválido';
  }
  if (formData.telefone?.trim()) {
    const r = validatePhone(formData.telefone);
    if (!r.valid) errors.telefone = r.message;
  }
  return errors;
};

export { validateEmail, validatePhone };
