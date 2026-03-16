export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateCPF = (cpf) => {
  const cpfLimpo = cpf.replace(/\D/g, '');

  if (cpfLimpo.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

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

export const validatePasswordStrength = (senha) => {
  const criterios = {
    tamanho: senha.length >= 8,
    maiuscula: /[A-Z]/.test(senha),
    minuscula: /[a-z]/.test(senha),
    numero: /\d/.test(senha),
    especial: /[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~]/.test(senha)
  };

  const criteriosAtingidos = Object.values(criterios).filter(Boolean).length;
  let nivel = criteriosAtingidos >= 4 ? 'forte' : criteriosAtingidos >= 3 ? 'media' : 'fraca';

  return {
    valida: criteriosAtingidos >= 2 && senha.length >= 6,
    nivel,
    criterios,
    score: criteriosAtingidos
  };
};
