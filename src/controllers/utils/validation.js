// Importar validadores centralizados
import {
  validateEmail,
  validateCPF,
  validatePasswordStrength,
  validatePhone
} from './shared-validators.js';

// Constantes de validação
export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_REGEX = /(?=.*[A-Z])(?=.*\d)/;
export const EMAIL_REGEX = /\S+@\S+\.\S+/;
export const USERNAME_MIN_LENGTH = 3;

/**
 * Valida formulário de login
 * @param {object} formData - { email, password }
 * @returns {object} Objeto com erros (vazio se válido)
 */
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
    const passwordValidation = validatePasswordStrength(formData.password);
    if (!passwordValidation.valid) {
      errors.password = 'Senha insuficientemente forte';
    }
  }
  
  return errors;
};

/**
 * Valida formulário de cadastro
 * @param {object} formData - { nome, email, password, confirmPassword, cpf, telefone, cidade, termos }
 * @returns {object} Objeto com erros (vazio se válido)
 */
export const validateCadastroForm = (formData) => {
  const errors = {};

  // Nome
  if (!formData.nome?.trim()) {
    errors.nome = 'Nome é obrigatório';
  }

  // Email
  if (!formData.email) {
    errors.email = 'Email é obrigatório';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Email inválido';
  }

  // Senha
  if (!formData.password) {
    errors.password = 'Senha é obrigatória';
  } else {
    const passwordValidation = validatePasswordStrength(formData.password);
    if (!passwordValidation.valid) {
      errors.password = 'Senha muito fraca';
    }
  }

  // Confirmar Senha
  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Confirmação de senha é obrigatória';
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Senhas não coincidem';
  }

  // Telefone
  if (!formData.telefone) {
    errors.telefone = 'Telefone é obrigatório';
  } else {
    const phoneValidation = validatePhone(formData.telefone);
    if (!phoneValidation.valid) {
      errors.telefone = phoneValidation.message;
    }
  }

  // Cidade
  if (!formData.cidade) {
    errors.cidade = 'Cidade é obrigatória';
  }

  // CPF (opcional se for vazio, mas se preenchido, deve ser válido)
  if (formData.cpf?.trim()) {
    const cpfValidation = validateCPF(formData.cpf);
    if (!cpfValidation.valid) {
      errors.cpf = cpfValidation.message;
    }
  }

  // Termos
  if (!formData.termos) {
    errors.termos = 'Você deve aceitar os termos de uso';
  }

  return errors;
};

/**
 * Valida formulário de edição de perfil
 * @param {object} formData - { nome, email, password, confirmPassword, cpf, telefone }
 * @returns {object} Objeto com erros (vazio se válido)
 */
export const validateEditarPerfilForm = (formData) => {
  const errors = {};

  if (!formData.nome?.trim()) {
    errors.nome = 'Nome é obrigatório';
  }

  // Se senha foi alterada
  if (formData.password?.trim()) {
    const passwordValidation = validatePasswordStrength(formData.password);
    if (!passwordValidation.valid) {
      errors.password = 'Senha muito fraca';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Senhas não coincidem';
    }
  }

  // CPF (opcional se for vazio, mas se preenchido, deve ser válido)
  if (formData.cpf?.trim()) {
    const cpfValidation = validateCPF(formData.cpf);
    if (!cpfValidation.valid) {
      errors.cpf = cpfValidation.message;
    }
  }

  // Telefone (opcional se for vazio, mas se preenchido, deve ser válido)
  if (formData.telefone?.trim()) {
    const phoneValidation = validatePhone(formData.telefone);
    if (!phoneValidation.valid) {
      errors.telefone = phoneValidation.message;
    }
  }

  return errors;
};

// Exportar validadores do shared também
export { validateEmail, validateCPF, validatePasswordStrength, validatePhone };
