import { useState } from 'react';

/**
 * Hook para validar CPF em tempo real
 * Retorna: { valor, erro, mensagem, valido }
 */
export const useCPFValidation = () => {
  const [cpf, setCpf] = useState('');
  const [erro, setErro] = useState('');

  const validarCPF = (cpfInput) => {
    const cpfLimpo = cpfInput.replace(/\D/g, '');

    // Verificar tamanho
    if (cpfLimpo.length !== 11) {
      return {
        valido: false,
        erro: `❌ CPF deve ter 11 dígitos (você informou ${cpfLimpo.length})`
      };
    }

    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpfLimpo)) {
      return {
        valido: false,
        erro: '❌ CPF inválido: todos os dígitos são iguais'
      };
    }

    // Validar primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    }
    let d1 = 11 - (soma % 11);
    d1 = d1 >= 10 ? 0 : d1;

    // Validar segundo dígito verificador
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
        valido: false,
        erro: '❌ CPF inválido: dígito(s) verificador(es) incorreto(s)'
      };
    }

    return { valido: true, erro: '' };
  };

  const handleChangeCPF = (valor) => {
    setCpf(valor);

    // Validar apenas se o campo não estiver vazio
    if (valor.trim()) {
      const validacao = validarCPF(valor);
      setErro(validacao.erro);
    } else {
      setErro('');
    }
  };

  return {
    cpf,
    setCpf: handleChangeCPF,
    erro,
    valido: !erro && cpf.trim() !== ''
  };
};
