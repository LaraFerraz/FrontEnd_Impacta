import React from "react";
import "./CTA.css";

const CTA = ({ titulo, descricao, botaoTexto }) => {
  return (
    <section className="CTA">
      <div className="container">
        <div className="cta-content">

          <h2>{titulo}</h2>

          <p>{descricao}</p>

          <button className="btn-primary">
            {botaoTexto}
          </button>

        </div>
      </div>
    </section>
  );
};

export default CTA;