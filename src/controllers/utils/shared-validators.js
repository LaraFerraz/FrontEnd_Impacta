/**
 * Validadores compartilhados entre Frontend e Backend
 * Centraliza lógica de validação para evitar duplicação
 */

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateCPF = (cpf) => {
  const cpfLimpo = cpf.replace(/\D/g, '');

  if (cpfLimpo.length !== 11) {
    return {
      valid: false,
      message: `CPF deve ter 11 dígitos (você informou ${cpfLimpo.length})`
    };
  }

  if (/^(\d)\1{10}$/.test(cpfLimpo)) {
    return {
      valid: false,
      message: 'CPF inválido: todos os dígitos são iguais'
    };
  }

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
  }
  let d1 = 11 - (soma % 11);
  d1 = d1 >= 10 ? 0 : d1;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
  }
  let d2 = 11 - (soma % 11);
  d2 = d2 >= 10 ? 0 : d2;

  const primeiroDigitoValido = d1 === parseInt(cpfLimpo.charAt(9));
  const segundoDigitoValido = d2 === parseInt(cpfLimpo.charAt(10));

  if (!primeiroDigitoValido || !segundoDigitoValido) {
    return {
      valid: false,
      message: 'CPF inválido: dígito(s) verificador(es) incorreto(s)'
    };
  }

  return { valid: true };
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-()\]]{10,20}$/;
  const valid = phoneRegex.test(phone.replace(/\s/g, ''));
  
  return {
    valid,
    ...((!valid) && {
      message: 'Telefone deve ter entre 10 e 20 dígitos/caracteres',
      example: '(11) 9999-9999 ou 11999999999'
    })
  };
};

export const validatePasswordStrength = (password) => {
  const criteria = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};:'",.<>?/\\|`~]/.test(password)
  };

  const criteriaTrue = Object.values(criteria).filter(Boolean).length;
  const strength = criteriaTrue >= 4 ? 'forte' : criteriaTrue >= 3 ? 'media' : 'fraca';
  const missing = [];

  if (!criteria.minLength) missing.push('8+ caracteres');
  if (!criteria.uppercase) missing.push('letra maiúscula');
  if (!criteria.lowercase) missing.push('letra minúscula');
  if (!criteria.number) missing.push('número');
  if (!criteria.special) missing.push('caractere especial');

  return {
    valid: criteriaTrue >= 2 && password.length >= 6,
    strength,
    message: `Senha ${strength} (${criteriaTrue}/5 critérios)`,
    missing,
    suggestion: missing.length > 0 ? `Adicione: ${missing.join(', ')}` : null,
    criteria
  };
};

export const validateUsername = (username) => {
  const valid = username.length >= 3 && /^[a-zA-Z0-9_-]+$/.test(username);
  return {
    valid,
    message: !valid ? 'Username deve ter 3+ caracteres, apenas letras, números, _ e -' : null
  };
};
