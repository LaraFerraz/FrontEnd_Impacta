import React, { useEffect, useState } from 'react';
import usePreferences from '../controllers/hooks/usePreferences';
import './PreferencesSelector.css';

const PreferencesSelector = ({ usuarioId }) => {
  const { categorias, userPreferences, loadCategorias, loadUserPreferences, addPreference, removePreference, loading, error } = usePreferences();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Carregar categorias e preferências do usuário
  useEffect(() => {
    const loadData = async () => {
      await loadCategorias();
      if (usuarioId) {
        await loadUserPreferences(usuarioId);
      }
    };
    loadData();
  }, [usuarioId, loadCategorias, loadUserPreferences]);

  // Atualizar selectedCategories quando userPreferences mudar
  useEffect(() => {
    const preferredIds = userPreferences.map(pref => pref.categoria_id);
    setSelectedCategories(preferredIds);
  }, [userPreferences]);

  /**
   * Lidar com checkbox de preferência
   */
  const handlePreferenceChange = async (categoriaId) => {
    setSaving(true);
    setMessage('');

    try {
      const isCurrentlySelected = selectedCategories.includes(categoriaId);
      
      if (isCurrentlySelected) {
        // Remover preferência
        const preferenceToRemove = userPreferences.find(p => p.categoria_id === categoriaId);
        if (preferenceToRemove) {
          await removePreference(usuarioId, preferenceToRemove.id);
          setMessage('Preferência removida com sucesso');
        }
      } else {
        // Adicionar preferência
        await addPreference(usuarioId, categoriaId);
        setMessage('Preferência adicionada com sucesso');
      }

      // Limpar mensagem após 2 segundos
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('Erro ao atualizar preferência');
      console.error('Erro:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="preferences-loading">Carregando preferências...</div>;
  }

  if (error) {
    return <div className="preferences-error">Erro: {error}</div>;
  }

  return (
    <div className="preferences-selector">
      <h3 className="preferences-title">Preferências de Campanhas</h3>
      <p className="preferences-description">
        Selecione as categorias de campanhas que você gostaria de acompanhar
      </p>

      {message && (
        <div className={`preferences-message ${message.includes('Erro') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="preferences-grid">
        {categorias && categorias.length > 0 ? (
          categorias.map(categoria => (
            <div key={categoria.id} className="preference-item">
              <input
                type="checkbox"
                id={`categoria-${categoria.id}`}
                checked={selectedCategories.includes(categoria.id)}
                onChange={() => handlePreferenceChange(categoria.id)}
                disabled={saving}
                className="preference-checkbox"
              />
              <label htmlFor={`categoria-${categoria.id}`} className="preference-label">
                {categoria.nome}
              </label>
            </div>
          ))
        ) : (
          <p className="no-categories">Nenhuma categoria disponível</p>
        )}
      </div>

      {selectedCategories.length > 0 && (
        <div className="preferences-selected">
          <strong>Categorias selecionadas ({selectedCategories.length}):</strong>
          <div className="selected-tags">
            {categorias
              .filter(cat => selectedCategories.includes(cat.id))
              .map(cat => (
                <span key={cat.id} className="tag">
                  {cat.nome}
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreferencesSelector;
