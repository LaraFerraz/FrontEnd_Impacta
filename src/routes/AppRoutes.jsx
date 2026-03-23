import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../views/pages/Home.jsx';
import Login from '../views/pages/Login.jsx';
import Cadastro from '../views/pages/Cadastro.jsx';
import Sobre from '../views/pages/Sobre.jsx';
import Perfil from '../views/pages/Perfil.jsx';
import NotFound from '../views/pages/NotFound.jsx';

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
      <Route path="/sobre" element={<Sobre />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
