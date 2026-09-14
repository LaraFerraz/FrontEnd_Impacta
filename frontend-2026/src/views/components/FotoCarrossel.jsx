import React, { useState } from 'react';
import './FotoCarrossel.css';

/**
 * Carrossel simples de fotos, sem dependências externas. Reutilizado no
 * card da listagem pública e no topo da página de detalhes da campanha.
 *
 * Props:
 *  - fotos: array de URLs (strings) já prontas para exibir, na ordem
 *    desejada (capa primeiro, depois galeria).
 *  - altBase: texto base do alt de cada imagem.
 *  - wrapperClassName: classe extra aplicada no container (controla altura
 *    e bordas conforme o contexto — card ou detalhes).
 *  - onFotoClick(indice): opcional, chamado ao clicar na foto atual
 *    (usado pra abrir o lightbox em tela cheia na página de detalhes).
 */
const FotoCarrossel = ({ fotos, altBase = 'Foto da campanha', wrapperClassName = '', onFotoClick }) => {
  const [indice, setIndice] = useState(0);

  if (!fotos || fotos.length === 0) return null;

  const indiceSeguro = indice < fotos.length ? indice : 0;

  const irParaAnterior = (e) => {
    e.stopPropagation();
    setIndice((atual) => (atual - 1 + fotos.length) % fotos.length);
  };

  const irParaProxima = (e) => {
    e.stopPropagation();
    setIndice((atual) => (atual + 1) % fotos.length);
  };

  const irParaIndice = (e, i) => {
    e.stopPropagation();
    setIndice(i);
  };

  return (
    <div className={`foto-carrossel ${wrapperClassName}`}>
      <img
        src={fotos[indiceSeguro]}
        alt={`${altBase} ${indiceSeguro + 1}`}
        className="foto-carrossel-imagem"
        onClick={onFotoClick ? () => onFotoClick(indiceSeguro) : undefined}
        style={onFotoClick ? { cursor: 'zoom-in' } : undefined}
      />

      {fotos.length > 1 && (
        <>
          <button
            type="button"
            className="foto-carrossel-seta foto-carrossel-seta-esquerda"
            onClick={irParaAnterior}
            aria-label="Foto anterior"
          >
            ‹
          </button>
          <button
            type="button"
            className="foto-carrossel-seta foto-carrossel-seta-direita"
            onClick={irParaProxima}
            aria-label="Próxima foto"
          >
            ›
          </button>

          <div className="foto-carrossel-dots">
            {fotos.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`foto-carrossel-dot ${i === indiceSeguro ? 'ativo' : ''}`}
                onClick={(e) => irParaIndice(e, i)}
                aria-label={`Ir para foto ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FotoCarrossel;
