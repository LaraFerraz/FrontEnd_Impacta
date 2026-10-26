import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../controllers/contexts/AuthContext';
import { useToast } from '../../controllers/hooks/useToast';
import CadastrarCampanha from '../components/CadastrarCampanha';
import MinhasCampanhasInscritas from '../components/MinhasCampanhasInscritas';
import MinhasCampanhasCriadas from '../components/MinhasCampanhasCriadas';
import MinhasAvaliacoes from '../components/MinhasAvaliacoes';
import PreferencesEditor from '../../components/PreferencesEditor';
import './Perfil.css';

const Perfil = () => {
  const { user, atualizarFoto } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [refreshCampanhasCriadas, setRefreshCampanhasCriadas] = useState(0);
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const fileInputRef = useRef(null);

  if (!user) return null;

  const handleSelecionarFoto = () => {
    fileInputRef.current?.click();
  };

  const handleFotoSelecionada = async (e) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    // Mesma validação do backend, só pra dar feedback mais rápido ao usuário
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    if (!tiposPermitidos.includes(arquivo.type)) {
      showToast('Formato inválido. Envie um arquivo .jpg, .jpeg, .png ou .webp', 'error');
      e.target.value = '';
      return;
    }
    if (arquivo.size > 5 * 1024 * 1024) {
      showToast('Arquivo muito grande. Tamanho máximo: 5MB', 'error');
      e.target.value = '';
      return;
    }

    setEnviandoFoto(true);
    try {
      await atualizarFoto(arquivo);
      showToast('Foto de perfil atualizada com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao atualizar foto de perfil:', error);
      showToast(error.message || 'Erro ao atualizar a foto de perfil', 'error');
    } finally {
      setEnviandoFoto(false);
      e.target.value = '';
    }
  };

  return (
    <div className="perfil-container">
      <div className="perfil-content">
        <div className="perfil-header">
          <div className="perfil-avatar" onClick={handleSelecionarFoto} style={{ cursor: 'pointer', position: 'relative' }}>
            {user.foto ? (
              <img
                src={user.foto}
                alt="Foto de perfil"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
            )}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: '#e84343',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: '#fff',
                border: '2px solid #fff'
              }}
              title="Trocar foto de perfil"
            >
              {enviandoFoto ? (
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="icone-carregando">
                  <path d="M21 12a9 9 0 1 1-9-9" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFotoSelecionada}
              style={{ display: 'none' }}
              disabled={enviandoFoto}
            />
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

            <div className="card-actions-inline">
              <button
                className="btn-primary"
                onClick={() => navigate('/editar-perfil')}
              >
                Editar Perfil
              </button>
            </div>
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

          <PreferencesEditor usuarioId={user.id} />

          <MinhasCampanhasInscritas usuarioId={user.id} />

          <MinhasCampanhasCriadas usuarioId={user.id} refreshTrigger={refreshCampanhasCriadas} />

          <MinhasAvaliacoes usuarioId={user.id} />

          <CadastrarCampanha
            usuarioId={user.id}
            onCampanhaCreated={() => {
              setRefreshCampanhasCriadas(prev => prev + 1);
            }}
          />

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