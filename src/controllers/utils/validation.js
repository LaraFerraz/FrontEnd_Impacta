export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  // Mínimo 8 caracteres
  return password.length >= 8;
};

export const validateRequired = (value) => {
  return value && value.trim() !== '';
};

export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = values[field];

    if (rule.required && !validateRequired(value)) {
      errors[field] = `${field} é obrigatório`;
    }

    if (rule.email && !validateEmail(value)) {
      errors[field] = 'Email inválido';
    }

    if (rule.minLength && value.length < rule.minLength) {
      errors[field] = `${field} deve ter no mínimo ${rule.minLength} caracteres`;
    }

    if (rule.custom && !rule.custom(value)) {
      errors[field] = rule.customMessage || 'Valor inválido';
    }
  });

  return errors;
};
