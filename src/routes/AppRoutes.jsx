import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../views/pages/Home.jsx';
import Login from '../views/pages/Login.jsx';
import Cadastro from '../views/pages/Cadastro.jsx';
import Sobre from '../views/pages/Sobre.jsx';
import Perfil from '../views/pages/Perfil.jsx';

/**
 * Configuração de rotas da aplicação
 */
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/perfil" element={<Perfil />} />
      {/* Rotas futuras */}
      <Route 
        path="/servicos" 
        element={
          <div style={{padding: '80px 20px', textAlign: 'center'}}>
            <h2>Página de Serviços em desenvolvimento</h2>
          </div>
        } 
      />
      <Route path="/sobre" element={<Sobre />} />
    </Routes>
  );
};

export default AppRoutes;
