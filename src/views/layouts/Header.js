import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from "../assets/logo.png";
import './Header.css';

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <div className="logo">
            <Link to="/">
               <img src={logo} alt="Impacta Logo" className="logo-img" />
               <h2>IMPACTA</h2>
            </Link>
          </div>
          
          <ul className="nav-links">
            <li>
              <Link 
                to="/" 
                className={location.pathname === '/' ? 'active' : ''}
              >
                Início
              </Link>
            </li>
            <li>
              <Link 
                to="/servicos" 
                className={location.pathname === '/servicos' ? 'active' : ''}
              >
                Serviços
              </Link>
            </li>
            <li>
              <Link 
                to="/sobre" 
                className={location.pathname === '/sobre' ? 'active' : ''}
              >
                Sobre
              </Link>
            </li>
          </ul>

          <div className="auth-buttons">
            <Link to="/login" className="btn-login">
              Entrar
            </Link>
            <Link to="/cadastro" className="btn-cadastro">
              Cadastrar
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;