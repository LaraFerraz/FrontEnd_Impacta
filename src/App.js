import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Sobre from './pages/Sobre';
import './styles/colors.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/sobre" element={<Sobre />} />
          {/* Rotas futuras */}
          <Route path="/servicos" element={<div style={{ padding: '80px 20px', textAlign: 'center' }}><h2>Página de Serviços em desenvolvimento</h2></div>} />
          <Route path="/sobre" element={<div style={{ padding: '80px 20px', textAlign: 'center' }}><h2>Página Sobre em desenvolvimento</h2></div>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
