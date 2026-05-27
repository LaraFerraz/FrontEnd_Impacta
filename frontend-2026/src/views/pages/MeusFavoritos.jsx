import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../controllers/contexts/AuthContext';
import useFavoritos from '../../controllers/hooks/useFavoritos';
import './MeusFavoritos.css';

const MeusFavoritos = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { favoritos, page, pagination, loading, error, loadUserFavoritos, setPage } = useFavoritos();

  useEffect(() => {
    if (user) {
      loadUserFavoritos(user.id, page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, page]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="meus-favoritos-container">
        <div className="loading">Carregando favoritos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="meus-favoritos-container">
        <div className="error-message">Erro ao carregar favoritos: {error}</div>
      </div>
    );
  }

  return (
    <div className="meus-favoritos-container">
      <div className="meus-favoritos-content">
        <div className="meus-favoritos-header">
          <div className="favoritos-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <h1>Meus Favoritos</h1>
        </div>

        {favoritos.length === 0 ? (
          <div className="favoritos-empty">
            <p>Você ainda não adicionou nenhuma campanha aos favoritos.</p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/campanhas')}
            >
              Explorar Campanhas
            </button>
          </div>
        ) : (
          <div className="favoritos-card">
            <div className="favoritos-info">
              <p className="favoritos-count">
                Total: <strong>{pagination.total}</strong> campanha(s) favoritada(s)
              </p>
            </div>

            <div className="favoritos-list">
              {favoritos.map((favorito) => (
                <div key={favorito.id} className="favorito-item">
                  <div className="favorito-header">
                    <h3>{favorito.projeto?.titulo || 'Campanha removida'}</h3>
                    <span className="favorito-badge">❤️ Favoritado</span>
                  </div>

                  <p className="favorito-description">
                    {favorito.projeto?.descricao || 'Descrição indisponível'}
                  </p>

                  <div className="favorito-details">
                    {favorito.projeto?.categoria && (
                      <span className="favorito-category">
                        {favorito.projeto.categoria.nome}
                      </span>
                    )}

                    {favorito.projeto?.cidade && (
                      <span className="favorito-location">
                        📍 {favorito.projeto.cidade.nome}
                      </span>
                    )}
                  </div>

                  <div className="favorito-actions">
                    <button
                      className="btn-view"
                      onClick={() => navigate(`/campanhas/${favorito.projeto_id}`)}
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {pagination.total_paginas > 1 && (
              <div className="paginacao">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="btn-paginacao"
                >
                  ← Anterior
                </button>

                <div className="paginas-info">
                  Página {page} de {pagination.total_paginas}
                </div>

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.total_paginas}
                  className="btn-paginacao"
                >
                  Próxima →
                </button>
              </div>
            )}
          </div>
        )}

        <div className="favoritos-footer">
          <button
            className="btn-secondary"
            onClick={() => navigate('/perfil')}
          >
            Voltar ao Perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeusFavoritos;
