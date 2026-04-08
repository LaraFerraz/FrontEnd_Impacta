import React, { useEffect } from 'react';
import { useAuth } from '../../controllers/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import './Perfil.css';

const Perfil = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="perfil-container">
      <div className="perfil-content">
        <div className="perfil-header">
          <div className="perfil-avatar">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </div>
          <h1>Meu Perfil</h1>
        </div>

        <div className="perfil-card">
          <div className="card-section">
            <h2>Informações Pessoais</h2>

            <div className="info-group">
              <label>Nome Completo</label>
              <p className="info-value">{user.nome}</p>
            </div>

            <div className="info-group">
              <label>Email</label>
              <p className="info-value">{user.email}</p>
            </div>

            {user.cpf && (
              <div className="info-group">
                <label>CPF</label>
                <p className="info-value">
                  {user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                </p>
              </div>
            )}

            {user.telefone && (
              <div className="info-group">
                <label>Telefone</label>
                <p className="info-value">
                  {user.telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}
                </p>
              </div>
            )}

            {user.data_nascimento && (
              <div className="info-group">
                <label>Data de Nascimento</label>
                <p className="info-value">
                  {new Date(user.data_nascimento).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}

            {user.genero && (
              <div className="info-group">
                <label>Gênero</label>
                <p className="info-value">
                  {user.genero === 'M' ? 'Masculino' : user.genero === 'F' ? 'Feminino' : 'Outro'}
                </p>
              </div>
            )}
          </div>

          {user.endereco && (
            <div className="card-section">
              <h2>Endereço</h2>

              <div className="info-group">
                <label>Logradouro</label>
                <p className="info-value">{user.endereco}</p>
              </div>

              {user.numero && (
                <div className="info-group">
                  <label>Número</label>
                  <p className="info-value">{user.numero}</p>
                </div>
              )}

              {user.complemento && (
                <div className="info-group">
                  <label>Complemento</label>
                  <p className="info-value">{user.complemento}</p>
                </div>
              )}

              {user.bairro && (
                <div className="info-group">
                  <label>Bairro</label>
                  <p className="info-value">{user.bairro}</p>
                </div>
              )}

              {user.cep && (
                <div className="info-group">
                  <label>CEP</label>
                  <p className="info-value">
                    {user.cep.replace(/(\d{5})(\d{3})/, '$1-$2')}
                  </p>
                </div>
              )}
            </div>
          )}

          {user.pais && (
            <div className="card-section">
              <h2>Localização</h2>

              {user.pais && (
                <div className="info-group">
                  <label>País</label>
                  <p className="info-value">{user.pais}</p>
                </div>
              )}

              {user.estado && (
                <div className="info-group">
                  <label>Estado</label>
                  <p className="info-value">{user.estado}</p>
                </div>
              )}

              {user.cidade && (
                <div className="info-group">
                  <label>Cidade</label>
                  <p className="info-value">{user.cidade}</p>
                </div>
              )}
            </div>
          )}

          <button onClick={() => navigate('/editar-perfil')}>
            Editar Perfil
          </button>

          <div className="card-actions">
            <button
              className="btn-secondary"
              onClick={() => navigate('/')}
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
