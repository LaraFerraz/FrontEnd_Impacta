import React, { createContext, useState, useCallback } from 'react';
import favoritosService from '../services/favoritosService';

export const FavoritosContext = createContext();

export const FavoritosProvider = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, total_paginas: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 10;

  /**
   * Carregar favoritos do usuário com paginação
   */
  const loadUserFavoritos = useCallback(async (usuarioId, pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      setPage(pageNum);
      const response = await favoritosService.getUserFavoritos(usuarioId, pageNum, limit);
      setFavoritos(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err.message || 'Erro ao carregar favoritos');
      console.error('Erro ao carregar favoritos:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  /**
   * Adicionar favorito
   */
  const addFavorito = useCallback(async (usuarioId, projetoId) => {
    try {
      setError(null);
      const response = await favoritosService.addFavorito(usuarioId, projetoId);
      // Recarregar favoritos após adicionar
      await loadUserFavoritos(usuarioId);
      return response.data;
    } catch (err) {
      setError(err.message || 'Erro ao adicionar favorito');
      console.error('Erro ao adicionar favorito:', err);
      throw err;
    }
  }, [loadUserFavoritos]);

  /**
   * Remover favorito
   */
  const removeFavorito = useCallback(async (usuarioId, favoritoId) => {
    try {
      setError(null);
      await favoritosService.removeFavorito(favoritoId);
      // Recarregar favoritos após remover
      await loadUserFavoritos(usuarioId);
    } catch (err) {
      setError(err.message || 'Erro ao remover favorito');
      console.error('Erro ao remover favorito:', err);
      throw err;
    }
  }, [loadUserFavoritos]);

  /**
   * Verificar se um projeto é favorito
   */
  const isFavorited = useCallback((projetoId) => {
    return favoritos.some(fav => fav.projeto_id === projetoId);
  }, [favoritos]);

  /**
   * Obter IDs dos projetos favoritados
   */
  const getFavoritoProjetoIds = useCallback(() => {
    return favoritos.map(fav => fav.projeto_id);
  }, [favoritos]);

  const value = {
    favoritos,
    page,
    pagination,
    limit,
    loading,
    error,
    setPage,
    loadUserFavoritos,
    addFavorito,
    removeFavorito,
    isFavorited,
    getFavoritoProjetoIds
  };

  return (
    <FavoritosContext.Provider value={value}>
      {children}
    </FavoritosContext.Provider>
  );
};

export default FavoritosContext;
