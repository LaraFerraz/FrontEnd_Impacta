import {
  validateEmail,
  validateCPF,
  validatePasswordStrength,
  formatCPF,
  validatePassword
} from '../../controllers/utils/validation';

describe('Validações Frontend', () => {
  describe('Email', () => {
    test('válido', () => {
      expect(validateEmail('user@example.com')).toBe(true);
    });

    test('inválido', () => {
      expect(validateEmail('userexample.com')).toBe(false);
    });
  });

  describe('CPF', () => {
    test('válido com formatação', () => {
      const resultado = validateCPF('123.456.789-09');
      expect(typeof resultado).toBe('boolean');
    });

    test('válido sem formatação', () => {
      const resultado = validateCPF('12345678909');
      expect(typeof resultado).toBe('boolean');
    });

    test('inválido - dígitos iguais', () => {
      expect(validateCPF('111.111.111-11')).toBe(false);
    });

    test('inválido - vazio', () => {
      expect(validateCPF('')).toBe(false);
    });
  });

  describe('Força de Senha', () => {
    test('retorna objeto com propriedades', () => {
      const resultado = validatePasswordStrength('Test123!');
      expect(resultado).toHaveProperty('valida');
      expect(resultado).toHaveProperty('nivel');
      expect(resultado).toHaveProperty('score');
    });

    test('fraca com poucos critérios', () => {
      const resultado = validatePasswordStrength('abc');
      expect(resultado.valida).toBe(false);
    });

    test('forte com muitos critérios', () => {
      const resultado = validatePasswordStrength('MyP@ssw0rd123');
      expect(resultado.valida).toBe(true);
    });
  });

  describe('Formato CPF', () => {
    test('formata corretamente', () => {
      expect(formatCPF('12345678909')).toBe('123.456.789-09');
    });
  });

  describe('Senha Simples', () => {
    test('válida com 6+ caracteres', () => {
      expect(validatePassword('123456')).toBe(true);
    });

    test('inválida com menos de 6', () => {
      expect(validatePassword('12345')).toBe(false);
    });
  });
});
