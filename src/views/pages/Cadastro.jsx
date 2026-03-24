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
    cpf: '',
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

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Nome
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    // Email
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Senha
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (!/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = 'Senha deve ter maiúscula, número e símbolo';
    }

    // Confirmar senha
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    // Telefone
    if (!formData.telefone) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    // Cidade
    if (!formData.cidade) {
      newErrors.cidade = 'Cidade é obrigatória';
    }

    // CPF
    if (!formData.cpf) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!/^\d{11}$/.test(formData.cpf.replace(/\D/g, ''))) {
      newErrors.cpf = 'CPF inválido';
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
      const { confirmPassword, termos, ...registerData } = formData;

      const response = await register(registerData);
      const userName = response.user?.nome?.split(' ')[0] || 'Usuário';

      showSuccess(`Bem-vindo(a), ${userName}! Sua conta foi criada com sucesso!`);

      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
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
                  <input name="nome" value={formData.nome} onChange={handleChange} />
                  {errors.nome && <span>{errors.nome}</span>}
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input name="email" value={formData.email} onChange={handleChange} />
                  {errors.email && <span>{errors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Senha</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} />
                  {errors.password && <span>{errors.password}</span>}
                </div>

                <div className="form-group">
                  <label>Confirmar Senha</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                  {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
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
                  className={errors.cpf ? 'error' : ''}
                />
                {errors.cpf && <span className="error-message">{errors.cpf}</span>}
              </div>


              <div className="form-group">
                <label>Telefone</label>
                <input name="telefone" value={formData.telefone} onChange={handleChange} />
                {errors.telefone && <span>{errors.telefone}</span>}
              </div>

              <div className="form-group">
                <label>Cidade</label>
                <input name="cidade" value={formData.cidade} onChange={handleChange} />
                {errors.cidade && <span>{errors.cidade}</span>}
              </div>

              {errors.submit && <span>{errors.submit}</span>}

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