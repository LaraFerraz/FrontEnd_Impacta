import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  const suggestedPages = [
    {
      id: 1,
      icone: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" />
        </svg>
      ),
      titulo: "Página Inicial",
      descricao: "Volte para a página inicial",
      rota: "/"
    },
    {
      id: 2,
      icone: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      titulo: "Meu Perfil",
      descricao: "Acesse sua conta e configurações",
      rota: "/perfil"
    },
    {
      id: 3,
      icone: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      ),
      titulo: "Cadastro",
      descricao: "Crie uma nova conta",
      rota: "/cadastro"
    },
    {
      id: 4,
      icone: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
      titulo: "Sobre Nós",
      descricao: "Conheça mais sobre o projeto",
      rota: "/sobre"
    }
  ];

  return (
    <main className="not-found">
      <section className="error-container">
        <div className="error-content">
          <div className="error-code">404</div>
          <h1 className="error-title">Página não encontrada</h1>
          <p className="error-description">
            Desculpe, a página que você está procurando não existe ou foi removida.
          </p>

          <button 
            onClick={() => navigate(-1)}
            className="btn-secondary back-btn"
          >
            ← Voltar para a página anterior
          </button>
        </div>

        <div className="error-graphic">
          <div className="error-icon">
            <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>
      </section>

      {/* Seção de Sugestões */}
      <section className="suggestions">
        <div className="container">
          <h2 className="suggestions-title">Páginas que você pode acessar</h2>
          
          <div className="services-grid">
            {suggestedPages.map(page => (
              <Link 
                key={page.id}
                to={page.rota}
                className="suggestion-card"
              >
                <div className="card-icon">{page.icone}</div>
                <h3 className="card-title">{page.titulo}</h3>
                <p className="card-description">{page.descricao}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotFound;
