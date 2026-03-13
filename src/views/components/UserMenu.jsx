import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../controllers/contexts/AuthContext';
import './UserMenu.css';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const handleProfile = () => {
    navigate('/perfil');
    setIsOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="user-menu-container" ref={menuRef}>
      <button 
        className="user-icon-button"
        onClick={() => setIsOpen(!isOpen)}
        title={`Perfil de ${user.nome}`}
      >
        <svg 
          className="user-icon" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </button>

      {isOpen && (
        <div className="user-dropdown">
          <div className="user-dropdown-header">
            <p className="user-name">{user.nome}</p>
            <p className="user-email">{user.email}</p>
          </div>
          
          <hr className="dropdown-divider" />
          
          <button 
            className="dropdown-item profile-item"
            onClick={handleProfile}
          >
            <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Meu Perfil</span>
          </button>
          
          <button 
            className="dropdown-item logout-item"
            onClick={handleLogout}
          >
            <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Sair</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
