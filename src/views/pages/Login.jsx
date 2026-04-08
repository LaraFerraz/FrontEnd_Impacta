import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../controllers/contexts/AuthContext';
import { useToast } from '../../controllers/hooks/useToast';
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (!/(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Senha deve ter pelo menos 1 letra maiúscula e 1 número';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
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
      
      showSuccess(`Bem-vindo de volta, ${userName}!`);
      
      setTimeout(() => navigate('/'), 1500);
      
    } catch (error) {
      console.error('Erro no login:', error);
      
      if (error.response?.data?.field) {
        setErrors({ 
          [error.response.data.field]: error.response.data.message 
        });
        showError(error.response.data.message);
      } else {
        const errorMsg = error.response?.data?.message || 'Erro ao fazer login. Tente novamente.';
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
                  className={errors.email ? 'error' : ''}
                  placeholder="seu@email.com"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  placeholder="Sua senha"
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
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