import React, { useEffect, useState } from 'react';
import usePreferences from '../controllers/hooks/usePreferences';
import './PreferencesEditor.css';

const PreferencesEditor = ({ usuarioId }) => {
  const { categorias, userPreferences, loadCategorias, loadUserPreferences, addPreference, removePreference, loading, error } = usePreferences();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      await loadCategorias();
      if (usuarioId) {
        await loadUserPreferences(usuarioId);
      }
    };
    loadData();
  }, [usuarioId, loadCategorias, loadUserPreferences]);

  useEffect(() => {
    const preferredIds = userPreferences.map(pref => pref.categoria_id);
    setSelectedCategories(preferredIds);
  }, [userPreferences]);

  const handlePreferenceChange = async (categoriaId) => {
    setSaving(true);
    setMessage('');

    try {
      const isCurrentlySelected = selectedCategories.includes(categoriaId);
      
      if (isCurrentlySelected) {
        const preferenceToRemove = userPreferences.find(p => p.categoria_id === categoriaId);
        if (preferenceToRemove) {
          await removePreference(usuarioId, preferenceToRemove.id);
          setMessage('✅ Preferência removida');
        }
      } else {
        await addPreference(usuarioId, categoriaId);
        setMessage('✅ Preferência adicionada');
      }

      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('❌ Erro ao atualizar');
      console.error('Erro:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="preferences-editor-loading">Carregando preferências...</div>;
  }

  if (error) {
    return <div className="preferences-editor-error">Erro ao carregar preferências</div>;
  }

  return (
    <div className="preferences-editor">
      <h2>Preferências de Campanhas</h2>
      <p className="preferences-subtitle">Selecione as categorias que você gostaria de acompanhar</p>

      {message && (
        <div className={`preferences-message ${message.includes('❌') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="preferences-grid">
        {categorias && categorias.length > 0 ? (
          categorias.map(categoria => (
            <div key={categoria.id} className="preference-item">
              <input
                type="checkbox"
                id={`pref-${categoria.id}`}
                checked={selectedCategories.includes(categoria.id)}
                onChange={() => handlePreferenceChange(categoria.id)}
                disabled={saving}
                className="preference-checkbox"
              />
              <label htmlFor={`pref-${categoria.id}`} className="preference-label">
                {categoria.nome}
              </label>
            </div>
          ))
        ) : (
          <p className="no-categories">Nenhuma categoria disponível</p>
        )}
      </div>

      {selectedCategories.length > 0 && (
        <div className="preferences-selected-inline">
          <strong>Selecionadas ({selectedCategories.length}):</strong>
          <div className="selected-tags-inline">
            {categorias
              .filter(cat => selectedCategories.includes(cat.id))
              .map(cat => (
                <span key={cat.id} className="tag-inline">
                  {cat.nome}
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreferencesEditor;
