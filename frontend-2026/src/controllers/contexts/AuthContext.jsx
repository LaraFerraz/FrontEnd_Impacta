
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      const currentUser = authService.getCurrentUser();
      const token = authService.getToken();
      
      setUser(currentUser);
      setIsAuthenticated(!!token);
      
      // Sincroniza o token com Axios se existir
      if (token) {
        api.setToken(token);
      }
      
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      setUser(response.user || response.data || response);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      setUser(response.user || response.data || response);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = async (userData) => {
  try {
    if (!user) throw new Error('Usuário não autenticado');
    
    const response = await api.put(`/users/${user.id}`, userData);
    
    // O backend retorna { message: "...", data: { id, nome, email, ... } }
    const dadosAtualizados = response.data?.data || response.data;
    
    // Mescla os dados novos com os dados atuais do usuário
    const updatedUser = { ...user, ...dadosAtualizados };
    
    // Salva no localStorage e atualiza o estado
    authService.setCurrentUser(updatedUser);
    setUser(updatedUser);
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

  /**
   * Envia uma nova foto de perfil (arquivo de imagem) e atualiza o
   * usuário em memória/localStorage com o caminho retornado pelo backend.
   *
   * @param {File} arquivo - Arquivo de imagem escolhido pelo usuário
   */
  const atualizarFoto = async (arquivo) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');

      const formData = new FormData();
      formData.append('foto', arquivo);

      const response = await api.uploadFile(`/users/${user.id}/foto`, formData);

      const dadosAtualizados = response.data?.data || response.data;
      const updatedUser = { ...user, ...dadosAtualizados };

      authService.setCurrentUser(updatedUser);
      setUser(updatedUser);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    atualizarFoto,
    isAuthenticated,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
