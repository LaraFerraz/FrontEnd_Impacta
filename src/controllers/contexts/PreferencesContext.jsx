import React, { createContext, useState, useCallback } from 'react';
import preferencesService from '../services/preferencesService';

export const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const [categorias, setCategorias] = useState([]);
  const [userPreferences, setUserPreferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Carregar todas as categorias disponíveis
   */
  const loadCategorias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await preferencesService.getAllCategorias();
      setCategorias(response.data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar categorias');
      console.error('Erro ao carregar categorias:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carregar preferências do usuário
   */
  const loadUserPreferences = useCallback(async (usuarioId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await preferencesService.getUserPreferences(usuarioId);
      setUserPreferences(response.data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar preferências');
      console.error('Erro ao carregar preferências:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Adicionar preferência
   */
  const addPreference = useCallback(async (usuarioId, categoriaId) => {
    try {
      setError(null);
      const response = await preferencesService.addPreference(usuarioId, categoriaId);
      // Recarregar preferências após adicionar
      await loadUserPreferences(usuarioId);
      return response.data;
    } catch (err) {
      setError(err.message || 'Erro ao adicionar preferência');
      console.error('Erro ao adicionar preferência:', err);
      throw err;
    }
  }, [loadUserPreferences]);

  /**
   * Remover preferência
   */
  const removePreference = useCallback(async (usuarioId, preferenceId) => {
    try {
      setError(null);
      await preferencesService.removePreference(preferenceId);
      // Recarregar preferências após remover
      await loadUserPreferences(usuarioId);
    } catch (err) {
      setError(err.message || 'Erro ao remover preferência');
      console.error('Erro ao remover preferência:', err);
      throw err;
    }
  }, [loadUserPreferences]);

  /**
   * Verificar se uma categoria é preferência do usuário
   */
  const isPreferred = useCallback((categoriaId) => {
    return userPreferences.some(pref => pref.categoria_id === categoriaId);
  }, [userPreferences]);

  /**
   * Obter IDs das categorias preferidas
   */
  const getPreferredCategoriaIds = useCallback(() => {
    return userPreferences.map(pref => pref.categoria_id);
  }, [userPreferences]);

  const value = {
    categorias,
    userPreferences,
    loading,
    error,
    loadCategorias,
    loadUserPreferences,
    addPreference,
    removePreference,
    isPreferred,
    getPreferredCategoriaIds
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export default PreferencesContext;
