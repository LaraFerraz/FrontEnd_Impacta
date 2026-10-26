import React, { useEffect } from 'react';
import usePreferences from '../controllers/hooks/usePreferences';
import './PreferencesDisplay.css';

const PreferencesDisplay = ({ usuarioId }) => {
  const { categorias, userPreferences, loadCategorias, loadUserPreferences, loading, error } = usePreferences();

  useEffect(() => {
    const loadData = async () => {
      await loadCategorias();
      if (usuarioId) {
        await loadUserPreferences(usuarioId);
      }
    };
    loadData();
  }, [usuarioId, loadCategorias, loadUserPreferences]);

  if (loading) {
    return <div className="preferences-loading">Carregando preferências...</div>;
  }

  if (error) {
    return <div className="preferences-error">Erro ao carregar preferências</div>;
  }

  // Se não houver preferências, mostrar mensagem
  if (!userPreferences || userPreferences.length === 0) {
    return (
      <div className="preferences-display">
        <h2>Preferências de Campanhas</h2>
        <p className="empty-message">Nenhuma preferência selecionada. Acesse editar perfil para adicionar.</p>
      </div>
    );
  }

  // Mostrar categorias preferidas
  const preferredCategories = categorias.filter(cat =>
    userPreferences.some(pref => pref.categoria_id === cat.id)
  );

  return (
    <div className="preferences-display">
      <h2>Preferências de Campanhas</h2>
      <div className="preferences-tags">
        {preferredCategories.map(cat => (
          <span key={cat.id} className="preference-tag">
            {cat.nome}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PreferencesDisplay;
