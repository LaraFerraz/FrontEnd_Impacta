import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import ServiceCard from "../components/ServiceCard";
import '../components/btn-primary.css';



const Home = () => {
  // useAuth pode ser usado futuramente para mostrar conteúdo personalizado
  // const { user, isAuthenticated } = useAuth();

  const servicos = [
    {
      id: 1,
      titulo: "Limpeza Comunitária",
      descricao: "Organize ou participe de mutirões de limpeza em sua comunidade",
      icone: "🧹"
    },
    {
      id: 2,
      titulo: "Assistência Social",
      descricao: "Conecte-se com pessoas que precisam de ajuda ou ofereça sua ajuda",
      icone: "🤝"
    },
    {
      id: 3,
      titulo: "Educação",
      descricao: "Compartilhe conhecimento ou aprenda com outros membros da comunidade",
      icone: "📚"
    },
    {
      id: 4,
      titulo: "Meio Ambiente",
      descricao: "Participe de iniciativas ambientais e sustentáveis",
      icone: "🌱"
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
            <div className="community-icon">👥</div>
            <div className="service-icons">
              <span>🤝</span>
              <span>🌱</span>
              <span>📚</span>
              <span>🏠</span>
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