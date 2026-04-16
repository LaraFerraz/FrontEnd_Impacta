import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../controllers/contexts/AuthContext';
import { useToast } from '../../controllers/hooks/useToast';
import { validateCadastroForm, validateCPF } from '../../controllers/utils/validation';
import { formatCPF, formatPhone } from '../../controllers/utils/formatters';
import { TIMEOUTS, MESSAGES } from '../../controllers/utils/constants';
import Toast from '../components/Toast';
import './Cadastro.css';

const Cadastro = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toasts, showSuccess, showError, removeToast } = useToast();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefone: '',
    cidade: '',
    cpf: '',
    interesses: [],
    termos: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [cpfErro, setCpfErro] = useState('');
  const [cpfValido, setCpfValido] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox' && name === 'interesses') {
      setFormData(prev => ({
        ...prev,
        interesses: checked
          ? [...prev.interesses, value]
          : prev.interesses.filter(interesse => interesse !== value)
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'cpf') {
      // Formatar CPF automaticamente
      const cpfFormatado = formatCPF(value);
      setFormData(prev => ({
        ...prev,
        [name]: cpfFormatado
      }));

      // ✅ Validar CPF em TEMPO REAL
      if (cpfFormatado.trim()) {
        const validacao = validateCPF(cpfFormatado);
        setCpfErro(validacao.valid ? '' : validacao.message);
        setCpfValido(validacao.valid);
      } else {
        setCpfErro('');
        setCpfValido(false);
      }
    } else if (name === 'telefone') {
      // Formatar Telefone automaticamente
      const telefoneFormatado = formatPhone(value);
      setFormData(prev => ({
        ...prev,
        [name]: telefoneFormatado
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateCadastroForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { confirmPassword, termos, ...registerData } = formData;

      const response = await register(registerData);
      const userName = response.user?.nome?.split(' ')[0] || 'Usuário';

      showSuccess(`${MESSAGES.CADASTRO.SUCCESS} Bem-vindo(a), ${userName}!`);

      setTimeout(() => navigate('/'), TIMEOUTS.REDIRECT_DELAY);
    } catch (error) {
      // Tratamento de erros com múltiplos campos
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorObj = {};
        error.response.data.errors.forEach(err => {
          // Combinar message e problema para exibição melhor
          errorObj[err.field] = {
            message: err.message,
            problema: err.problema
          };
        });
        setErrors(errorObj);
        
        // Mostrar toast com mensagem geral
        showError(error.response.data.message || 'Verifique os erros nos campos abaixo');
      } else if (error.response?.data?.field) {
        setErrors({
          [error.response.data.field]: {
            message: error.response.data.message,
            problema: error.response.data.problema
          }
        });
        showError(error.response.data.message);
      } else {
        const errorMsg = error.response?.data?.message || MESSAGES.CADASTRO.ERROR;
        setErrors({ submit: errorMsg });
        showError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="cadastro-page">
      <div className="container">
        <div className="cadastro-container">
          <div className="cadastro-side">
            <div className="side-content">
              <h2>Junte-se à nossa comunidade!</h2>
              <p>
                Cadastre-se gratuitamente e comece a fazer a diferença em sua
                comunidade hoje mesmo.
              </p>
            </div>
          </div>

          <div className="cadastro-card card">
            <div className="cadastro-header">
              <h1>Criar Conta</h1>
              <p>Preencha os dados abaixo</p>
            </div>

            <form onSubmit={handleSubmit} className="cadastro-form">

              <div className="form-row">
                <div className="form-group">
                  <label>Nome</label>
                  <input 
                    name="nome" 
                    value={formData.nome} 
                    onChange={handleChange}
                    className={errors.nome ? 'input-error' : ''}
                  />
                  {errors.nome && (
                    <div className="error-container">
                      <p className="error-message">
                        {typeof errors.nome === 'object' ? errors.nome.message : errors.nome}
                      </p>
                      {typeof errors.nome === 'object' && errors.nome.problema && (
                        <p className="error-detail">💡 {errors.nome.problema}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange}
                    className={errors.email ? 'input-error' : ''}
                  />
                  {errors.email && (
                    <div className="error-container">
                      <p className="error-message">
                        {typeof errors.email === 'object' ? errors.email.message : errors.email}
                      </p>
                      {typeof errors.email === 'object' && errors.email.problema && (
                        <p className="error-detail">💡 {errors.email.problema}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Senha</label>
                  <input 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange}
                    className={errors.password ? 'input-error' : ''}
                  />
                  {errors.password && (
                    <div className="error-container">
                      <p className="error-message">
                        {typeof errors.password === 'object' ? errors.password.message : errors.password}
                      </p>
                      {typeof errors.password === 'object' && errors.password.problema && (
                        <p className="error-detail">💡 {errors.password.problema}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Confirmar Senha</label>
                  <input 
                    type="password" 
                    name="confirmPassword" 
                    value={formData.confirmPassword} 
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'input-error' : ''}
                  />
                  {errors.confirmPassword && (
                    <div className="error-container">
                      <p className="error-message">{errors.confirmPassword}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>CPF</label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  className={cpfErro ? 'input-error' : cpfValido ? 'input-valid' : ''}
                />
                {cpfErro && (
                  <div className="error-container">
                    <p className="error-message">{cpfErro}</p>
                  </div>
                )}
                {cpfValido && (
                  <div className="success-container">
                    <p className="success-message">CPF válido</p>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Telefone</label>
                <input 
                  name="telefone" 
                  value={formData.telefone} 
                  onChange={handleChange}
                  placeholder="(11) 9999-9999"
                  className={errors.telefone ? 'input-error' : ''}
                />
                {errors.telefone && (
                  <div className="error-container">
                    <p className="error-message">
                      {typeof errors.telefone === 'object' ? errors.telefone.message : errors.telefone}
                    </p>
                    {typeof errors.telefone === 'object' && errors.telefone.problema && (
                      <p className="error-detail">💡 {errors.telefone.problema}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Cidade</label>
                <input 
                  name="cidade" 
                  value={formData.cidade} 
                  onChange={handleChange}
                  className={errors.cidade ? 'input-error' : ''}
                />
                {errors.cidade && (
                  <div className="error-container">
                    <p className="error-message">{errors.cidade}</p>
                  </div>
                )}
              </div>

              {errors.submit && (
                <div className="error-container form-submit-error">
                  <p className="error-message">{errors.submit}</p>
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Criando...' : 'Criar Conta'}
              </button>
            </form>

            <p>
              Já tem conta? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>

      <Toast toasts={toasts} onRemove={removeToast} />
    </main >
  );
};

export default Cadastro;