import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import ServiceCard from "../components/ServiceCard";



const Home = () => {
  // useAuth pode ser usado futuramente para mostrar conteúdo personalizado
  // const { user, isAuthenticated } = useAuth();

  const servicos = [
    {
      id: 1,
      titulo: "Limpeza Comunitária",
      descricao: "Organize ou participe de mutirões de limpeza em sua comunidade",
      icone: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="m19 5-7 7-4-4-6 6" />
          <path d="M2 20h20" />
          <path d="m14 3 3-2 3 2" />
        </svg>
      )
    },
    {
      id: 2,
      titulo: "Assistência Social",
      descricao: "Conecte-se com pessoas que precisam de ajuda ou ofereça sua ajuda",
      icone: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 20h5v-2a4 4 0 0 0-3-3.87" />
          <path d="M9 20H4v-2a4 4 0 0 1 3-3.87" />
          <circle cx="9" cy="7" r="4" />
          <path d="M15 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      id: 3,
      titulo: "Educação",
      descricao: "Compartilhe conhecimento ou aprenda com outros membros da comunidade",
      icone: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />
        </svg>
      )
    },
    {
      id: 4,
      titulo: "Meio Ambiente",
      descricao: "Participe de iniciativas ambientais e sustentáveis",
      icone: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 4 13c0-4 3-8 7-9 1 3 2 5 4 6 2-1 3-3 3-5 3 2 5 5 5 8a7 7 0 0 1-7 7Z" />
          <path d="M11 20v-6" />
        </svg>
      )
    }
  ];

  return (
    <main className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Conectando comunidades através do
              <span className="highlight"> voluntariado</span>
            </h1>
            <p className="hero-description">
              Descubra oportunidades de voluntariado, conecte-se com sua comunidade
              e faça a diferença. Junte-se a nós para construir um mundo melhor.
            </p>
            <div className="hero-buttons">

              <Link to="/serviços" className="btn-primary">
                Começar Agora
              </Link>
              <Link to="/sobre" className="btn-secondary">
                Saiba Mais
              </Link>
            </div>

          </div>
        </div>

        <div className="hero-image">
          <div className="hero-graphic">
            <div className="community-icon">
              <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="service-icons">
              <span>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </span>
              <span>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 4 13c0-4 3-8 7-9 1 3 2 5 4 6 2-1 3-3 3-5 3 2 5 5 5 8a7 7 0 0 1-7 7Z" />
                </svg>
              </span>
              <span>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />
                </svg>
              </span>
              <span>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Serviços */}
      <section className="services">
        <div className="container">
          <div className="section-header">
            <h2>Nossos Serviços Comunitários</h2>
            <p>Explore as diferentes maneiras de contribuir com sua comunidade</p>
          </div>

          <div className="services-grid">
            <div className="services-grid">
              {servicos.map(servico => (
                <ServiceCard
                  key={servico.id}
                  icone={servico.icone}
                  titulo={servico.titulo}
                  descricao={servico.descricao}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Estatísticas */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3 className="stat-number">500+</h3>
              <p className="stat-label">Voluntários Ativos</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">120+</h3>
              <p className="stat-label">Projetos Realizados</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">50+</h3>
              <p className="stat-label">Comunidades Atendidas</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">1000+</h3>
              <p className="stat-label">Pessoas Beneficiadas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Call to Action */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Pronto para fazer a diferença?</h2>
            <p>Cadastre-se agora e comece a contribuir com sua comunidade hoje mesmo!</p>
            <Link to="/cadastro" className="btn-primary">
              Cadastrar
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;