import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../controllers/contexts/AuthContext';
import UserMenu from '../components/UserMenu';
import logo from "../../assets/logo.png";
import './Header.css';

const Header = () => {
  const location = useLocation();
  const { user, loading } = useAuth();

  // Não mostrar botões de auth nas páginas de login/cadastro
  const isAuthPage = ['/login', '/cadastro'].includes(location.pathname);

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
                to="/sobre" 
                className={location.pathname === '/sobre' ? 'active' : ''}
              >
                Sobre
              </Link>
            </li>
          </ul>

          {!isAuthPage && (
            <div className="auth-buttons">
              {loading ? (
                <div className="loading">Carregando...</div>
              ) : user ? (
                <UserMenu />
              ) : (
                <>
                  <Link to="/login" className="btn-login">
                    Entrar
                  </Link>
                  <Link to="/cadastro" className="btn-cadastro">
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;