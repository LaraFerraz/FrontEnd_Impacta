import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../controllers/contexts/AuthContext';
import { useToast } from '../../controllers/hooks/useToast';
import { validateLoginForm } from '../../controllers/utils/validation';
import { TIMEOUTS, MESSAGES } from '../../controllers/utils/constants';
import Toast from '../components/Toast';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toasts, showSuccess, showError, removeToast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Remove error quando usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateLoginForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      // Usar serviço de autenticação real
      const response = await login(formData.email, formData.password);
      const userName = response.user?.nome?.split(' ')[0] || 'Usuário';
      
      showSuccess(`${MESSAGES.LOGIN.SUCCESS} ${userName}!`);
      
      setTimeout(() => navigate('/'), TIMEOUTS.REDIRECT_DELAY);
      
    } catch (error) {
      console.error('Erro no login:', error);
      
      // Tratamento de erros com múltiplos campos
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorObj = {};
        error.response.data.errors.forEach(err => {
          errorObj[err.field] = {
            message: err.message,
            problema: err.problema
          };
        });
        setErrors(errorObj);
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
        const errorMsg = error.response?.data?.message || MESSAGES.LOGIN.ERROR;
        setErrors({ submit: errorMsg });
        showError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="container">
        <div className="login-container">
          <div className="login-card card">
            <div className="login-header">
              <h1>Entrar</h1>
              <p>Acesse sua conta para continuar</p>
            </div>
            
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'input-error' : ''}
                  placeholder="seu@email.com"
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
              
              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'input-error' : ''}
                  placeholder="Sua senha"
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
              
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Lembrar de mim</span>
                </label>
                <Link to="/esqueci-senha" className="forgot-password">
                  Esqueceu a senha?
                </Link>
              </div>
              
              {errors.submit && (
                <div className="error-message submit-error">{errors.submit}</div>
              )}
              
              <button 
                type="submit" 
                className={`btn-primary login-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-spinner">
                    <span className="spinner"></span>
                    Entrando...
                  </span>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>
            
            <div className="login-footer">
              <p>
                Não tem uma conta? 
                <Link to="/cadastro" className="signup-link"> Cadastre-se</Link>
              </p>
            </div>
          </div>
          
          <div className="login-side">
            <div className="side-content">
              <h2>Bem-vindo de volta!</h2>
              <p>
                Continue contribuindo para tornar sua comunidade um lugar melhor.
                Juntos podemos fazer a diferença!
              </p>
              <div className="community-benefits">
                <div className="benefit">
                  <span className="benefit-icon">🤝</span>
                  <span>Conecte-se com voluntários</span>
                </div>
                <div className="benefit">
                  <span className="benefit-icon">📊</span>
                  <span>Acompanhe seu impacto</span>
                </div>
                <div className="benefit">
                  <span className="benefit-icon">🌟</span>
                  <span>Descubra novas oportunidades</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toast toasts={toasts} onRemove={removeToast} />
    </main>
  );
};

export default Login;