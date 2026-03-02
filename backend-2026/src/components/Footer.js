import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>ServiçosComunidade</h3>
            <p>Conectando pessoas para transformar comunidades através do voluntariado e colaboração.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="LinkedIn">💼</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Navegação</h4>
            <ul className="footer-links">
              <li><Link to="/">Início</Link></li>
              <li><Link to="/servicos">Serviços</Link></li>
              <li><Link to="/sobre">Sobre</Link></li>
              <li><Link to="/contato">Contato</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Comunidade</h4>
            <ul className="footer-links">
              <li><Link to="/login">Entrar</Link></li>
              <li><Link to="/cadastro">Cadastrar</Link></li>
              <li><Link to="/projetos">Projetos</Link></li>
              <li><Link to="/eventos">Eventos</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Suporte</h4>
            <ul className="footer-links">
              <li><Link to="/ajuda">Central de Ajuda</Link></li>
              <li><Link to="/termos">Termos de Uso</Link></li>
              <li><Link to="/privacidade">Privacidade</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 ServiçosComunidade. Todos os direitos reservados.</p>
          <p>Desenvolvido com ❤️ para fortalecer comunidades</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;