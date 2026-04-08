import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../controllers/services/api';
import RatingComponent from './RatingComponent';
import './CampanhaDetalhes.css';

const CampanhaDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campanha, setCampanha] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    carregarDetalhes();
    
    // Carregar dados do usuário
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUsuario(JSON.parse(userData));
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const carregarDetalhes = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/projetos/${id}`);
      
      if (response && response.data) {
        setCampanha(response.data);
      }
    } catch (err) {
      console.error('Erro ao carregar campanha:', err);
      setError('Erro ao carregar detalhes da campanha');
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (statusNome) => {
    const statusMap = {
      'Planejamento': '#FFA500',
      'Em Andamento': '#4CAF50',
      'Concluída': '#2196F3',
      'Cancelada': '#F44336'
    };
    return statusMap[statusNome] || '#999';
  };

  if (loading) return <div className="loading-full">Carregando...</div>;
  if (error) return <div className="error-full">{error}</div>;
  if (!campanha) return <div className="error-full">Campanha não encontrada</div>;

  const infos = campanha.informacoes;
  const mediaAvaliacoes = campanha.avaliacoes?.length > 0
    ? (campanha.avaliacoes.reduce((acc, av) => acc + av.nota, 0) / campanha.avaliacoes.length).toFixed(1)
    : 0;

  return (
    <div className="campanha-detalhes-container">
      {/* Header */}
      <div className="detalhes-header">
        <button onClick={() => navigate('/campanhas')} className="btn-voltar">
          ← Voltar
        </button>
        <div className="titulo-section">
          <h1>{campanha.titulo}</h1>
          <span className="status-badge" style={{ backgroundColor: getStatusColor(campanha.status.nome) }}>
            {campanha.status.nome}
          </span>
        </div>
      </div>

      {/* Informações Principais */}
      <div className="info-principais">
        <div className="info-card">
          <h3>Informações da Campanha</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Criador:</span>
              <span className="value">{campanha.criador.nome}</span>
            </div>
            <div className="info-item">
              <span className="label">Cidade:</span>
              <span className="value">{campanha.cidade.nome}</span>
            </div>
            <div className="info-item">
              <span className="label">Categoria:</span>
              <span className="value">{campanha.categoria.nome}</span>
            </div>
            <div className="info-item">
              <span className="label">Data de Criação:</span>
              <span className="value">{formatarData(campanha.data_criacao)}</span>
            </div>
            <div className="info-item">
              <span className="label">Início:</span>
              <span className="value">{formatarData(campanha.data_inicio)}</span>
            </div>
            <div className="info-item">
              <span className="label">Término:</span>
              <span className="value">{formatarData(campanha.data_fim)}</span>
            </div>
            {campanha.meta_participantes && (
              <div className="info-item">
                <span className="label">Meta de Participantes:</span>
                <span className="value">{campanha.meta_participantes}</span>
              </div>
            )}
            <div className="info-item">
              <span className="label">Total de Participantes:</span>
              <span className="value">{campanha.participacoes?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Avaliações */}
        <div className="info-card avaliacoes-card">
          <h3>Avaliações</h3>
          <div className="avaliacoes-stats">
            <div className="media-avaliacoes">
              <div className="nota-grande">{mediaAvaliacoes}</div>
              <small>({campanha.avaliacoes?.length || 0} {campanha.avaliacoes?.length === 1 ? 'avaliação' : 'avaliações'})</small>
            </div>
            <div className="stars">
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} className={`star ${star <= Math.round(mediaAvaliacoes) ? 'filled' : ''}`}>
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Descrição */}
      <div className="descricao-section">
        <h3>Descrição da Campanha</h3>
        <p>{campanha.descricao}</p>
      </div>

      {/* Informações Detalhadas */}
      {infos && (
        <div className="informacoes-detalhadas">
          <h3>Informações Detalhadas</h3>
          <div className="detalhes-grid">
            {infos.objetivos && (
              <div className="detalhe-item">
                <h4>Objetivos</h4>
                <p>{infos.objetivos}</p>
              </div>
            )}
            {infos.publico_alvo && (
              <div className="detalhe-item">
                <h4>Público Alvo</h4>
                <p>{infos.publico_alvo}</p>
              </div>
            )}
            {infos.impacto_esperado && (
              <div className="detalhe-item">
                <h4>Impacto Esperado</h4>
                <p>{infos.impacto_esperado}</p>
              </div>
            )}
            {infos.regras && (
              <div className="detalhe-item">
                <h4>Regras</h4>
                <p>{infos.regras}</p>
              </div>
            )}
            {infos.observacoes && (
              <div className="detalhe-item">
                <h4>Observações</h4>
                <p>{infos.observacoes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Componente de Avaliações */}
      {usuario && (
        <RatingComponent projetoId={id} onRatingSuccess={() => carregarDetalhes()} />
      )}

      {/* Serviços Disponíveis */}
      {campanha.servicos && campanha.servicos.length > 0 && (
        <div className="servicos-section">
          <h3>Serviços Disponíveis</h3>
          <div className="servicos-grid">
            {campanha.servicos.map(servico => (
              <div key={servico.id} className="servico-card">
                <h4>{servico.nome_servico}</h4>
                <p className="descricao">{servico.descricao}</p>
                <div className="servico-info">
                  <span>Necessário(s): {servico.quantidade_necessaria}</span>
                  <span className="status">{servico.status.nome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampanhaDetalhes;
