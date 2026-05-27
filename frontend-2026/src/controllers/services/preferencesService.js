import api from './api';

const API_BASE_URL = '/preferencias';

const preferencesService = {
  /**
   * Obter todas as categorias disponíveis
   */
  getAllCategorias() {
    return api.get('/categorias');
  },

  /**
   * Obter preferências do usuário
   * @param {number} usuarioId - ID do usuário
   */
  getUserPreferences(usuarioId) {
    return api.get(`${API_BASE_URL}/usuario/${usuarioId}`);
  },

  /**
   * Obter uma preferência específica
   * @param {number} preferenceId - ID da preferência
   */
  getPreference(preferenceId) {
    return api.get(`${API_BASE_URL}/${preferenceId}`);
  },

  /**
   * Adicionar uma preferência para o usuário
   * @param {number} usuarioId - ID do usuário
   * @param {number} categoriaId - ID da categoria
   */
  addPreference(usuarioId, categoriaId) {
    return api.post(API_BASE_URL, {
      usuario_id: usuarioId,
      categoria_id: categoriaId
    });
  },

  /**
   * Remover uma preferência
   * @param {number} preferenceId - ID da preferência
   */
  removePreference(preferenceId) {
    return api.delete(`${API_BASE_URL}/${preferenceId}`);
  },

  /**
   * Remover preferência por usuario_id e categoria_id
   * @param {number} usuarioId - ID do usuário
   * @param {number} categoriaId - ID da categoria
   */
  removePreferenceByIds(usuarioId, categoriaId) {
    // Usar uma rota auxiliar ou passar como query params
    return api.delete(`${API_BASE_URL}/usuario/${usuarioId}/categoria/${categoriaId}`);
  }
};

export default preferencesService;
