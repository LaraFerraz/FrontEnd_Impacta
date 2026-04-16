import { useCPFValidation } from '../../controllers/hooks/useCPFValidation';
import './CPFInput.css';

/**
 * Componente de Input para CPF com validação em tempo real
 * Props:
 *   - value: valor externo (opcional)
 *   - onChange: callback quando CPF muda
 *   - disabled: desabilita o input
 *   - required: marca como obrigatório
 */
const CPFInput = ({ value, onChange, disabled = false, required = false, label = 'CPF' }) => {
  const cpfValidator = useCPFValidation();

  const handleChange = (e) => {
    const novoValor = e.target.value;
    cpfValidator.setCpf(novoValor);

    // Chamar callback pai se fornecido
    if (onChange) {
      onChange(novoValor);
    }
  };

  return (
    <div className="cpf-input-group">
      <label htmlFor="cpf" className="cpf-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        id="cpf"
        type="text"
        className={`cpf-input ${cpfValidator.erro ? 'input-error' : ''} ${cpfValidator.valido ? 'input-valid' : ''}`}
        placeholder="000.000.000-00 ou 00000000000"
        value={cpfValidator.cpf}
        onChange={handleChange}
        disabled={disabled}
        maxLength="14"
      />
      {cpfValidator.erro && (
        <span className="error-message">{cpfValidator.erro}</span>
      )}
      {cpfValidator.valido && (
        <span className="success-message"> CPF válido</span>
      )}
    </div>
  );
};

export default CPFInput;
