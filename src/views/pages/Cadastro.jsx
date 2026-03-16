import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../controllers/contexts/AuthContext';
import { useToast } from '../../controllers/hooks/useToast';
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
    interesses: [],
    termos: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

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
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }
    
    if (!formData.telefone) {
      newErrors.telefone = 'Telefone é obrigatório';
    }
    
    if (!formData.cidade) {
      newErrors.cidade = 'Cidade é obrigatória';
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
      // Separar confirmPassword do resto dos dados
      const { confirmPassword, termos, ...registerData } = formData;
      
      // Chamar serviço de registro real
      const response = await register(registerData);
      const userName = response.user?.nome?.split(' ')[0] || 'Usuário';
      
      // Mostrar mensagem de sucesso
      showSuccess(`Bem-vindo(a), ${userName}! Sua conta foi criada com sucesso!`);
      
      // Redirecionar para home após cadastro bem-sucedido
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Erro no cadastro:', error);
      
      // Tratar erros específicos
      if (error.response?.data?.field) {
        setErrors({ 
          [error.response.data.field]: error.response.data.message 
        });
        showError(error.response.data.message);
      } else {
        const errorMsg = error.response?.data?.message || 'Erro ao criar conta. Tente novamente.';
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
                comunidade hoje mesmo. Conecte-se, colabore e transforme!
              </p>
              <div className="join-stats">
                <div className="stat">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Voluntários</span>
                </div>
                <div className="stat">
                  <span className="stat-number">120+</span>
                  <span className="stat-label">Projetos</span>
                </div>
                <div className="stat">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Cidades</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="cadastro-card card">
            <div className="cadastro-header">
              <h1>Criar Conta</h1>
              <p>Preencha os dados abaixo para se cadastrar</p>
            </div>
            
            <form onSubmit={handleSubmit} className="cadastro-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nome">Nome Completo</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className={errors.nome ? 'error' : ''}
                    placeholder="Seu nome completo"
                  />
                  {errors.nome && <span className="error-message">{errors.nome}</span>}
                </div>
                
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
              </div>
              
              <div className="form-row">
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
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar Senha</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'error' : ''}
                    placeholder="Confirme sua senha"
                  />
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="telefone">Telefone</label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className={errors.telefone ? 'error' : ''}
                    placeholder="(11) 99999-9999"
                  />
                  {errors.telefone && <span className="error-message">{errors.telefone}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="cidade">Cidade</label>
                  <input
                    type="text"
                    id="cidade"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    className={errors.cidade ? 'error' : ''}
                    placeholder="Sua cidade"
                  />
                  {errors.cidade && <span className="error-message">{errors.cidade}</span>}
                </div>
              </div>
              
              {errors.submit && (
                <div className="error-message submit-error">{errors.submit}</div>
              )}
              
              <button 
                type="submit" 
                className={`btn-primary cadastro-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-spinner">
                    <span className="spinner"></span>
                    Criando conta...
                  </span>
                ) : (
                  'Criar Conta'
                )}
              </button>
            </form>
            
            <div className="cadastro-footer">
              <p>
                Já tem uma conta? 
                <Link to="/login" className="login-link"> Entre aqui</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast notifications */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </main>
  );
};

export default Cadastro;