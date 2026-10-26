import React, { useState, useEffect } from 'react';
import api from '../../controllers/services/api';
import './RatingComponent.css';

const RatingComponent = ({ projetoId, onRatingSuccess }) => {
  const [usuarioId, setUsuarioId] = useState(null);
  const [nota, setNota] = useState(0);
  const [hoverNota, setHoverNota] = useState(0);
  const [avaliacao, setAvaliacao] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Carrega o usuário do localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUsuarioId(user.id);
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
      }
    }
  }, []);

  // Carregar avaliação existente
  useEffect(() => {
    if (usuarioId) {
      carregarAvaliacao();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projetoId, usuarioId]);

  const carregarAvaliacao = async () => {
    try {
      const response = await api.get(`/avaliacoes?usuario_id=${usuarioId}&projeto_id=${projetoId}`);
      
      if (response && response.data && response.data.length > 0) {
        const userAvaliacao = response.data.find(av => av.usuario_id === usuarioId);
        if (userAvaliacao) {
          setAvaliacao(userAvaliacao);
          setNota(userAvaliacao.nota);
        }
      }
    } catch (err) {
      console.error('Erro ao carregar avaliação:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (nota === 0) {
        setError('Selecione uma nota');
        setLoading(false);
        return;
      }

      const url = avaliacao ? `/avaliacoes/${avaliacao.id}` : `/avaliacoes`;

      const response = avaliacao
        ? await api.put(url, { usuario_id: usuarioId, projeto_id: projetoId, nota })
        : await api.post(url, { usuario_id: usuarioId, projeto_id: projetoId, nota });

      if (response) {
        setAvaliacao(response.data);
        setSuccess(response.message || 'Avaliação salva com sucesso!');
        
        setTimeout(() => {
          if (onRatingSuccess) onRatingSuccess();
        }, 1500);
      }
    } catch (err) {
      console.error('Erro:', err);
      setError(err.message || 'Erro ao salvar avaliação');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAvaliacao = async () => {
    if (!avaliacao) return;

    if (!window.confirm('Tem certeza que deseja deletar esta avaliação?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.delete(`/avaliacoes/${avaliacao.id}`);

      setAvaliacao(null);
      setNota(0);
      setSuccess('Avaliação deletada com sucesso!');
      
      setTimeout(() => {
        if (onRatingSuccess) onRatingSuccess();
      }, 1500);
    } catch (err) {
      console.error('Erro:', err);
      setError(err.message || 'Erro ao deletar avaliação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rating-component">
      <h3>Deixe sua Avaliação</h3>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="rating-form">
        <div className="stars-group">
          <label className="stars-label">Sua nota:</label>
          <div className="stars-container">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                className={`star-btn ${star <= (hoverNota || nota) ? 'active' : ''}`}
                onClick={() => setNota(star)}
                onMouseEnter={() => setHoverNota(star)}
                onMouseLeave={() => setHoverNota(0)}
              >
                ★
              </button>
            ))}
          </div>
          <span className="nota-texto">
            {nota > 0 ? `${nota} ${nota === 1 ? 'estrela' : 'estrelas'}` : 'Clique para avaliar'}
          </span>
        </div>

        {avaliacao && (
          <div className="info-avaliacao">
            <small>Avaliação criada em: {new Date(avaliacao.data_avaliacao).toLocaleDateString('pt-BR')}</small>
          </div>
        )}

        <div className="button-group">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || nota === 0}
          >
            {loading ? 'Salvando...' : avaliacao ? 'Atualizar Avaliação' : 'Enviar Avaliação'}
          </button>

          {avaliacao && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDeleteAvaliacao}
              disabled={loading}
            >
              {loading ? 'Deletando...' : 'Deletar Avaliação'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RatingComponent;
