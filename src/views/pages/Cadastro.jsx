import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../controllers/contexts/AuthContext';
import { useToast } from '../../controllers/hooks/useToast';
import { validateEmail, validateCPF, validatePasswordStrength } from '../../controllers/utils/validation';
import Toast from '../components/Toast';
import './Cadastro.css';

const Cadastro = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toasts, showSuccess, showError, removeToast } = useToast();
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    password: '',
    confirmPassword: '',
    telefone: '',
    cidade: '',
    interesses: [],
    termos: false
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [loading, setLoading] = useState(false);

  const interessesOptions = [
    'Limpeza Comunitária',
    'Assistência Social',
    'Educação',
    'Meio Ambiente',
    'Esportes',
    'Arte e Cultura',
    'Tecnologia',
    'Saúde'
  ];

  /**
   * Trata mudanças nos campos do formulário
   */
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
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      let novoValor = value;

      // Máscara para CPF
      if (name === 'cpf') {
        novoValor = value.replace(/\D/g, '').slice(0, 11);
        novoValor = novoValor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      }

      setFormData(prev => ({ ...prev, [name]: novoValor }));
    }

    // Avaliar força da senha em tempo real
    if (name === 'password') {
      const strength = validatePasswordStrength(value);
      setPasswordStrength(strength);
    }

    // Remove erro quando usuário começa editar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Valida todos os campos do formulário
   */
  const validarFormulario = () => {
    const newErrors = {};

    // Validar nome
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Validar email
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email deve ser válido';
    }

    // Validar CPF
    if (!formData.cpf) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    // Validar senha com força
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else {
      const strength = validatePasswordStrength(formData.password);
      if (!strength.valida) {
        newErrors.password = 'Senha fraca. Use maiúsculas, minúsculas, números e símbolos';
      }
    }

    // Validar confirmação de senha
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    // Validar telefone
    if (!formData.telefone) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    // Validar cidade
    if (!formData.cidade) {
      newErrors.cidade = 'Cidade é obrigatória';
    }

    // Validar interesses
    if (formData.interesses.length === 0) {
      newErrors.interesses = 'Selecione pelo menos um interesse';
    }

    // Validar termos
    if (!formData.termos) {
      newErrors.termos = 'Você deve aceitar os termos e condições';
    }

    return newErrors;
  };

  /**
   * Handler do submit do formulário
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validarFormulario();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const dadosCadastro = {
        ...formData,
        cpf: formData.cpf.replace(/\D/g, '') // Remove máscara antes enviar
      };

      await register(dadosCadastro);

      showSuccess(`Bem-vindo(a), ${formData.nome.split(' ')[0]}! Cadastro realizado com sucesso.`);

      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Erro no cadastro:', error);

      const errorMsg = error.response?.data?.message || 'Erro ao criar conta. Tente novamente.';
      const field = error.response?.data?.field;

      if (field) {
        setErrors({ [field]: errorMsg });
      } else {
        setErrors({ submit: errorMsg });
      }

      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Retorna indicador visual de força da senha
   */
  const renderPasswordStrength = () => {
    if (!passwordStrength) return null;

    const cores = { fraca: '#e74c3c', media: '#f39c12', forte: '#27ae60' };
    const cor = cores[passwordStrength.nivel];

    return (
      <div className="password-strength">
        <div className="strength-bar">
          <div
            className="strength-fill"
            style={{
              width: `${(passwordStrength.score / 5) * 100}%`,
              backgroundColor: cor
            }}
          />
        </div>
        <small style={{ color: cor }}>
          Senha {passwordStrength.nivel} ({passwordStrength.score}/5 critérios)
        </small>
      </div>
    );
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
                    required
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
                    required
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cpf">CPF</label>
                  <input
                    type="text"
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    className={errors.cpf ? 'error' : ''}
                    placeholder="000.000.000-00"
                    maxLength="14"
                    required
                  />
                  {errors.cpf && <span className="error-message">{errors.cpf}</span>}
                </div>

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
                    required
                  />
                  {errors.telefone && <span className="error-message">{errors.telefone}</span>}
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
                    required
                  />
                  {renderPasswordStrength()}
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
                    required
                  />
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>
              </div>

              <div className="form-row">
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
                    required
                  />
                  {errors.cidade && <span className="error-message">{errors.cidade}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Áreas de Interesse</label>
                <div className="interests-grid">
                  {interessesOptions.map(interesse => (
                    <label key={interesse} className="interest-item">
                      <input
                        type="checkbox"
                        name="interesses"
                        value={interesse}
                        checked={formData.interesses.includes(interesse)}
                        onChange={handleChange}
                      />
                      <span>{interesse}</span>
                    </label>
                  ))}
                </div>
                {errors.interesses && <span className="error-message">{errors.interesses}</span>}
              </div>

              <div className="form-group">
                <label className="terms-checkbox">
                  <input
                    type="checkbox"
                    name="termos"
                    checked={formData.termos}
                    onChange={handleChange}
                  />
                  <span>
                    Concordo com os <Link to="/termos">Termos de Uso</Link> e
                    <Link to="/privacidade"> Política de Privacidade</Link>
                  </span>
                </label>
                {errors.termos && <span className="error-message">{errors.termos}</span>}
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