import api from './api';

const API_BASE_URL = '/favoritos';

const favoritosService = {
  /**
   * Obter todos os favoritos do usuário com paginação
   * @param {number} usuarioId - ID do usuário
   * @param {number} page - Número da página (padrão: 1)
   * @param {number} limit - Itens por página (padrão: 10)
   */
  getUserFavoritos(usuarioId, page = 1, limit = 10) {
    return api.get(`${API_BASE_URL}/usuario/${usuarioId}?page=${page}&limit=${limit}`);
  },

  /**
   * Obter um favorito específico
   * @param {number} favoritoId - ID do favorito
   */
  getFavorito(favoritoId) {
    return api.get(`${API_BASE_URL}/${favoritoId}`);
  },

  /**
   * Adicionar um favorito
   * @param {number} usuarioId - ID do usuário
   * @param {number} projetoId - ID do projeto
   */
  addFavorito(usuarioId, projetoId) {
    return api.post(API_BASE_URL, {
      usuario_id: usuarioId,
      projeto_id: projetoId
    });
  },

  /**
   * Remover um favorito
   * @param {number} favoritoId - ID do favorito
   */
  removeFavorito(favoritoId) {
    return api.delete(`${API_BASE_URL}/${favoritoId}`);
  },

  /**
   * Verificar se um projeto é favorito do usuário
   * @param {number} usuarioId - ID do usuário
   * @param {number} projetoId - ID do projeto
   */
  isFavorited(usuarioId, projetoId) {
    return api.get(`${API_BASE_URL}/usuario/${usuarioId}/projeto/${projetoId}`);
  }
};

export default favoritosService;
