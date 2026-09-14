export interface FieldValidationResult {
  valid: boolean;
  message?: string | null;
}

export interface PasswordStrengthResult {
  valid: boolean;
  strength: 'forte' | 'fraca';
  suggestion: string | null;
}

export const validateEmail = (email: string): FieldValidationResult => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid = regex.test(email);
  return { valid, message: valid ? null : 'Email inválido' };
};

export const validateCPF = (cpfInput: string): FieldValidationResult => {
  const cpf = cpfInput.replace(/[^\d]/g, '');

  if (cpf.length !== 11) {
    return { valid: false, message: 'CPF deve conter 11 dígitos' };
  }

  if (/^(\d)\1{10}$/.test(cpf)) {
    return { valid: false, message: 'CPF inválido: sequência de dígitos repetidos' };
  }

  return { valid: true, message: null };
};

export const validatePhone = (phone: string): FieldValidationResult => {
  const regex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
  return { valid: regex.test(phone) };
};

export const validatePasswordStrength = (password: string): PasswordStrengthResult => {
  const strong = password.length >= 6 && /[A-Za-z]/.test(password) && /\d/.test(password);

  return {
    valid: strong,
    strength: strong ? 'forte' : 'fraca',
    suggestion: strong ? null : 'A senha deve ter pelo menos 6 caracteres com letras e números'
  };
};
