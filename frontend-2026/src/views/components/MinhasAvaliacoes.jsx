import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../controllers/services/api';
import { useToast } from '../../controllers/hooks/useToast';
import './MinhasCampanhasInscritas.css';
import './MinhasCampanhasCriadas.css';

/**
 * Lista todas as avaliações feitas pelo usuário, com opção de
 * editar (navega até a campanha, onde o RatingComponent cuida disso)
 * ou excluir diretamente.
 */
const MinhasAvaliacoes = ({ usuarioId }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [excluindoId, setExcluindoId] = useState(null);

  const carregarAvaliacoes = useCallback(async () => {
    if (!usuarioId) return;
    setLoading(true);
    setErro('');
    try {
      const response = await api.get(`/avaliacoes?usuario_id=${usuarioId}`);
      const lista = response?.data || response || [];
      setAvaliacoes(Array.isArray(lista) ? lista : []);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
      setErro('Erro ao carregar suas avaliações');
      setAvaliacoes([]);
    } finally {
      setLoading(false);
    }
  }, [usuarioId]);

  useEffect(() => {
    carregarAvaliacoes();
  }, [carregarAvaliacoes]);

  const renderEstrelas = (nota) =>
    [1, 2, 3, 4, 5].map(star => (
      <span key={star} style={{ color: star <= nota ? '#f59e0b' : '#d1d5db', fontSize: '18px' }}>★</span>
    ));

  const formatarData = (data) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const handleExcluir = async (avaliacao) => {
    if (!window.confirm('Tem certeza que deseja excluir esta avaliação?')) return;
    setExcluindoId(avaliacao.id);
    try {
      await api.delete(`/avaliacoes/${avaliacao.id}`);
      showToast('Avaliação excluída com sucesso', 'success');
      await carregarAvaliacoes();
    } catch (error) {
      console.error('Erro ao excluir avaliação:', error);
      showToast(error.message || 'Erro ao excluir avaliação', 'error');
    } finally {
      setExcluindoId(null);
    }
  };

  if (loading && avaliacoes.length === 0) {
    return (
      <div className="minhas-campanhas-container">
        <h2>⭐ Minhas Avaliações</h2>
        <div className="loading-message">Carregando suas avaliações...</div>
      </div>
    );
  }

  return (
    <div className="minhas-campanhas-container">
      <div className="minhas-campanhas-header">
        <h2>⭐ Minhas Avaliações</h2>
        <p className="subtitulo">Avaliações que você deu em campanhas — total: {avaliacoes.length}</p>
      </div>

      {erro && <div className="erro-message">{erro}</div>}

      {avaliacoes.length === 0 && !loading ? (
        <div className="sem-campanhas">
          <p>Você ainda não avaliou nenhuma campanha</p>
        </div>
      ) : (
        <div className="campanhas-grid">
          {avaliacoes.map((avaliacao) => (
            <div key={avaliacao.id} className="campanha-inscrita-card">
              <div className="card-header">
                <h3>{avaliacao.projeto?.titulo || `Campanha #${avaliacao.projeto_id}`}</h3>
                <div>{renderEstrelas(avaliacao.nota)}</div>
              </div>

              {avaliacao.comentario && (
                <p className="descricao">"{avaliacao.comentario}"</p>
              )}

              <div className="card-info">
                <div className="info-item">
                  <span className="label">Nota:</span>
                  <span className="value">{avaliacao.nota}/5</span>
                </div>
                <div className="info-item">
                  <span className="label">Data:</span>
                  <span className="value">{formatarData(avaliacao.data_avaliacao || avaliacao.createdAt)}</span>
                </div>
              </div>

              <div className="campanha-criada-acoes">
                <button
                  onClick={() => navigate(`/campanhas/${avaliacao.projeto_id}`)}
                  className="btn-ver-detalhes"
                >
                  Ver Campanha
                </button>
                <button
                  onClick={() => navigate(`/campanhas/${avaliacao.projeto_id}`)}
                  className="btn-editar-card"
                >
                   Editar Nota
                </button>
                <button
                  onClick={() => handleExcluir(avaliacao)}
                  disabled={excluindoId === avaliacao.id}
                  className="btn-excluir-card"
                >
                  {excluindoId === avaliacao.id ? 'Excluindo...' : '🗑️ Excluir'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MinhasAvaliacoes;