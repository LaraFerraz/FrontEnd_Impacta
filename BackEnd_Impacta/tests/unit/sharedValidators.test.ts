import { validateEmail, validateCPF, validatePhone, validatePasswordStrength } from '../../src/validators/sharedValidators';

describe('sharedValidators', () => {
  describe('validateEmail', () => {
    it('aceita um email válido', () => {
      expect(validateEmail('usuario@dominio.com').valid).toBe(true);
    });

    it('rejeita email sem @', () => {
      expect(validateEmail('usuario-dominio.com').valid).toBe(false);
    });
  });

  describe('validateCPF', () => {
    it('rejeita CPF com menos de 11 dígitos', () => {
      expect(validateCPF('123').valid).toBe(false);
    });

    it('rejeita CPF com todos os dígitos iguais', () => {
      expect(validateCPF('11111111111').valid).toBe(false);
    });

    it('aceita CPF com 11 dígitos não repetidos', () => {
      expect(validateCPF('123.456.789-09').valid).toBe(true);
    });
  });

  describe('validatePhone', () => {
    it('aceita telefone no formato (11) 99999-9999', () => {
      expect(validatePhone('(11) 99999-9999').valid).toBe(true);
    });

    it('rejeita telefone com poucos dígitos', () => {
      expect(validatePhone('123').valid).toBe(false);
    });
  });

  describe('validatePasswordStrength', () => {
    it('considera fraca uma senha só com letras', () => {
      expect(validatePasswordStrength('abcdef').valid).toBe(false);
    });

    it('considera forte uma senha com letras e números e 6+ caracteres', () => {
      expect(validatePasswordStrength('abc123').valid).toBe(true);
    });
  });
});
