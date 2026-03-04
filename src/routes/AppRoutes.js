import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../views/pages/Home';
import Login from '../views/pages/Login';
import Cadastro from '../views/pages/Cadastro';

/**
 * Configuração de rotas da aplicação
 */
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      {/* Rotas futuras */}
      <Route 
        path="/servicos" 
        element={
          <div style={{padding: '80px 20px', textAlign: 'center'}}>
            <h2>Página de Serviços em desenvolvimento</h2>
          </div>
        } 
      />
      <Route 
        path="/sobre" 
        element={
          <div style={{padding: '80px 20px', textAlign: 'center'}}>
            <h2>Página Sobre em desenvolvimento</h2>
          </div>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
