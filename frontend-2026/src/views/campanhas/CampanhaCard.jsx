import React from 'react';
import { Link } from 'react-router-dom';
import FotoCarrossel from '../components/FotoCarrossel';
import './CampanhaCard.css';

const CampanhaCard = ({ campanha, onDeleteSuccess }) => {

  const formatarData = (data) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (statusNome) => {
    const badgeClass = `status-badge status-${statusNome?.toLowerCase().replace(/\s+/g, '-')}`;
    return badgeClass;
  };

  // Capa primeiro, depois as fotos da galeria — é a ordem que o carrossel exibe.
  const fotosCampanha = [
    ...(campanha.imagem ? [campanha.imagem] : []),
    ...((campanha.imagens || []).map((img) => img.caminho))
  ];

  return (
    <div className="campanha-card">
      <div className="campanha-card-imagem-wrapper">
        {fotosCampanha.length > 0 ? (
          <FotoCarrossel fotos={fotosCampanha} altBase={campanha.titulo} />
        ) : (
          <div className="campanha-card-imagem-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
      </div>

      <div className="card-header">
        <h3 className="titulo">{campanha.titulo}</h3>
        <span className={getStatusBadge(campanha.status?.nome || "Sem status")}>
  {campanha.status?.nome || "Sem status"}
</span>
      </div>

      <p className="descricao">
  {campanha.descricao
    ? `${campanha.descricao.substring(0, 100)}...`
    : "Sem descrição"}
</p>

      <div className="card-meta">
        <div className="meta-item">
          <span className="label">Categoria:</span>
          {campanha.categoria?.nome || "Sem categoria"}
        </div>
        <div className="meta-item">
          <span className="label">Criador:</span>
          <span className="value">{campanha.criador?.nome || "Sem criador"}</span>
        </div>
        <div className="meta-item">
          <span className="label">Cidade:</span>
          <span className="value">{campanha.cidade?.nome || "Sem cidade"}</span>
        </div>
      </div>

      <div className="card-dates">
        <div className="date-item">
          <small>Início: {formatarData(campanha.data_inicio)}</small>
        </div>
        <div className="date-item">
          <small>Fim: {formatarData(campanha.data_fim)}</small>
        </div>
      </div>

      {campanha.meta_participantes && (
        <div className="meta-participantes">
          <small>META: {campanha.meta_participantes} participantes</small>
        </div>
      )}

      <Link to={`/campanhas/${campanha.id}`} className="btn-detalhes">
        Ver Detalhes
      </Link>
    </div>
  );
};

export default CampanhaCard;
