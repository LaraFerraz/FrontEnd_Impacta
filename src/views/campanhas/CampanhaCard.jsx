import React from 'react';
import { Link } from 'react-router-dom';
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

  return (
    <div className="campanha-card">
      <div className="card-header">
        <h3 className="titulo">{campanha.titulo}</h3>
        <span className={getStatusBadge(campanha.status.nome)}>
          {campanha.status.nome}
        </span>
      </div>

      <p className="descricao">{campanha.descricao.substring(0, 100)}...</p>

      <div className="card-meta">
        <div className="meta-item">
          <span className="label">Categoria:</span>
          <span className="value">{campanha.categoria.nome}</span>
        </div>
        <div className="meta-item">
          <span className="label">Criador:</span>
          <span className="value">{campanha.criador.nome}</span>
        </div>
        <div className="meta-item">
          <span className="label">Cidade:</span>
          <span className="value">{campanha.cidade.nome}</span>
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
