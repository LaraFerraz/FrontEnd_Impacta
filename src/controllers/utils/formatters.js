export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('pt-BR');
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

/**
 * Formata CPF com máscara: XXX.XXX.XXX-XX
 * @param {string} cpf - CPF sem formatação
 * @returns {string} CPF formatado
 */
export const formatCPF = (cpf) => {
  const apenasNumeros = cpf.replace(/\D/g, '');
  
  if (apenasNumeros.length <= 3) {
    return apenasNumeros;
  } else if (apenasNumeros.length <= 6) {
    return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3)}`;
  } else if (apenasNumeros.length <= 9) {
    return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6)}`;
  } else {
    return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6, 9)}-${apenasNumeros.slice(9, 11)}`;
  }
};

/**
 * Formata Telefone com máscara: (XX) XXXXX-XXXX
 * @param {string} phone - Telefone sem formatação
 * @returns {string} Telefone formatado
 */
export const formatPhone = (phone) => {
  const apenasNumeros = phone.replace(/\D/g, '');
  
  if (apenasNumeros.length <= 2) {
    return apenasNumeros;
  } else if (apenasNumeros.length <= 7) {
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
  } else {
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7, 11)}`;
  }
};

/**
 * Formata Gênero para texto legível
 * @param {string} gender - 'M', 'F' ou outro valor
 * @returns {string} Texto formatado
 */
export const formatGender = (gender) => {
  const genders = {
    'M': 'Masculino',
    'F': 'Feminino'
  };
  return genders[gender] || 'Outro';
};

/**
 * Remove formatação de CPF/Phone/Etc, deixando apenas números
 * @param {string} value - Valor formatado
 * @returns {string} Apenas números
 */
export const removeFormatting = (value) => {
  return value.replace(/\D/g, '');
};
