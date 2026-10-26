import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  const suggestedPages = [
    {
      id: 1,
      icone: "🏠",
      titulo: "Página Inicial",
      descricao: "Volte para a página inicial",
      rota: "/"
    },
    {
      id: 2,
      icone: "👤",
      titulo: "Meu Perfil",
      descricao: "Acesse sua conta e configurações",
      rota: "/perfil"
    },
    {
      id: 3,
      icone: "📝",
      titulo: "Cadastro",
      descricao: "Crie uma nova conta",
      rota: "/cadastro"
    },
    {
      id: 4,
      icone: "ℹ️",
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
          <div className="error-icon">🔍</div>
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
