import React from "react";
import "./ServiceCard.css";


const ServiceCard = ({ icone, titulo, descricao }) => {
  return (
    <div className="service-card card">

      <div className="service-icon">
        <span>{icone}</span>
      </div>

      <h3>{titulo}</h3>

      <p>{descricao}</p>

      <button className="btn-secondary">
        Ver Mais
      </button>

    </div>
  );
};

export default ServiceCard;


