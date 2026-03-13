/**
 * Validação de email com regex RFC5322
 * @param {string} email - Email a validar
 * @returns {boolean} - Email é válido
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validação de CPF com algoritmo de dígito verificador
 * Remove caracteres especiais e verifica tamanho e integridade
 * @param {string} cpf - CPF a validar
 * @returns {boolean} - CPF é válido
 */
export const validateCPF = (cpf) => {
  const cpfLimpo = cpf.replace(/\D/g, '');

  if (cpfLimpo.length !== 11) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(cpfLimpo)) {
    return false;
  }

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
  }
  const primeiroDigito = 11 - (soma % 11);

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
  }
  const segundoDigito = 11 - (soma % 11);

  return primeiroDigito === parseInt(cpfLimpo.charAt(10)) &&
         segundoDigito === parseInt(cpfLimpo.charAt(11));
};

/**
 * Valida força da senha por critérios de segurança
 * Retorna nível: fraca, média ou forte
 * @param {string} senha - Senha a avaliar
 * @returns {object} - { valida: boolean, nivel: string, criterios: object }
 */
export const validatePasswordStrength = (senha) => {
  const criterios = {
    tamanho: senha.length >= 8,
    maiuscula: /[A-Z]/.test(senha),
    minuscula: /[a-z]/.test(senha),
    numero: /\d/.test(senha),
    especial: /[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~]/.test(senha)
  };

  const criteriosAtingidos = Object.values(criterios).filter(Boolean).length;

  let nivel = 'fraca';
  if (criteriosAtingidos >= 4) {
    nivel = 'forte';
  } else if (criteriosAtingidos >= 3) {
    nivel = 'media';
  }

  const valida = criteriosAtingidos >= 2 && senha.length >= 6;

  return {
    valida,
    nivel,
    criterios,
    score: criteriosAtingidos
  };
};

/**
 * Formata CPF para exibição (XXX.XXX.XXX-XX)
 * @param {string} cpf - CPF sem formatação
 * @returns {string} - CPF formatado
 */
export const formatCPF = (cpf) => {
  const cpfLimpo = cpf.replace(/\D/g, '');
  return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Validação de campo requerido
 * @param {string} value - Valor a validar
 * @returns {boolean} - Valor é válido
 */
export const validateRequired = (value) => {
  return value && value.trim() !== '';
};

/**
 * Validação de força de senha simples (compatível com anterior)
 * @param {string} password - Senha a validar
 * @returns {boolean} - Senha tem no mínimo 6 caracteres
 */
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Validação genérica de formulário
 * @param {object} values - Valores do formulário
 * @param {object} rules - Regras de validação
 * @returns {object} - Objeto com erros por campo
 */
export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = values[field];

    if (rule.required && !validateRequired(value)) {
      errors[field] = `${field} é obrigatório`;
    }

    if (rule.email && value && !validateEmail(value)) {
      errors[field] = 'Email inválido';
    }

    if (rule.cpf && value && !validateCPF(value)) {
      errors[field] = 'CPF inválido';
    }

    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${field} deve ter no mínimo ${rule.minLength} caracteres`;
    }

    if (rule.passwordStrength && value) {
      const strength = validatePasswordStrength(value);
      if (!strength.valida) {
        errors[field] = 'Senha fraca. Use maiúsculas, minúsculas, números e símbolos';
      }
    }

    if (rule.custom && value && !rule.custom(value)) {
      errors[field] = rule.customMessage || 'Valor inválido';
    }
  });

  return errors;
};
