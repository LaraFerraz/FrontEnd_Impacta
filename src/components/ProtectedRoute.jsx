import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../controllers/contexts/AuthContext';

/**
 * ProtectedRoute - Componente wrapper para rotas autenticadas
 * 
 * Funções:
 * 1. Aguarda o contexto de autenticação terminar de carregar (loading=false)
 * 2. Verifica se o usuário está autenticado
 * 3. Redireciona para /login se não estiver autenticado
 * 4. Renderiza o componente se autenticado
 * 5. Mostra "Carregando..." enquanto verifica a autenticação
 * 
 * Uso:
 * <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Enquanto carrega, mostra um indicador de carregamento
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '24px',
            marginBottom: '16px'
          }}>⏳</div>
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se carregou e não há usuário, redireciona para login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se autenticado, renderiza o componente
  return children;
};

export default ProtectedRoute;
