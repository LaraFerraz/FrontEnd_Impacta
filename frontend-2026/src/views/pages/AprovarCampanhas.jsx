import React, { useState, useEffect, useCallback } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../controllers/contexts/AuthContext';
import { useToast } from '../../controllers/hooks/useToast';
import api from '../../controllers/services/api';
import './AprovarCampanhas.css';

/**
 * Tela exclusiva de admin: lista as campanhas pendentes de aprovação
 * (aprovado = false) e permite aprovar ou reprovar cada uma.
 *
 * A checagem "só admin acessa" acontece em duas camadas:
 *  1. Aqui no front (esconde/redireciona quem não é admin).
 *  2. No backend, a rota PATCH /projetos/:id/aprovar já exige admin
 *     de qualquer forma - então mesmo burlando o front, ninguém
 *     consegue aprovar nada sem ser admin de verdade.
 */
const AprovarCampanhas = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const ehAdmin = user?.tipo?.id === 1 || user?.tipo?.nome === 'Admin';

  const [campanhas, setCampanhas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [processandoId, setProcessandoId] = useState(null);

  const carregarPendentes = useCallback(async () => {
    setLoading(true);
    setErro('');
    try {
      const response = await api.get('/projetos?aprovado=false&limit=50');
      setCampanhas(response?.data || []);
    } catch (error) {
      console.error('Erro ao carregar campanhas pendentes:', error);
      setErro('Erro ao carregar campanhas pendentes de aprovação');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ehAdmin) {
      carregarPendentes();
    }
  }, [ehAdmin, carregarPendentes]);

  // Usuário logado mas não é admin: manda de volta pra Home.
  if (user && !ehAdmin) {
    return <Navigate to="/" replace />;
  }

  const formatarData = (data) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const handleDecisao = async (campanha, aprovado) => {
    setProcessandoId(campanha.id);
    try {
      await api.patch(`/projetos/${campanha.id}/aprovar`, { aprovado });
      showToast(
        aprovado ? `Campanha "${campanha.titulo}" aprovada!` : `Campanha "${campanha.titulo}" reprovada`,
        aprovado ? 'success' : 'info'
      );
      // Remove da lista local, já que ela deixa de ser "pendente"
      setCampanhas((prev) => prev.filter((c) => c.id !== campanha.id));
    } catch (error) {
      console.error('Erro ao processar aprovação:', error);
      showToast(error.message || 'Erro ao processar a campanha', 'error');
    } finally {
      setProcessandoId(null);
    }
  };

  return (
    <div className="aprovar-container">
      <div className="aprovar-header">
        <div>
          <h1>Aprovar Campanhas</h1>
          <p>Campanhas novas ficam pendentes até um admin revisar e aprovar</p>
        </div>
        <button className="btn-atualizar" onClick={carregarPendentes} disabled={loading}>
          {loading ? 'Atualizando...' : '↻ Atualizar lista'}
        </button>
      </div>

      {erro && <div className="alert-erro">{erro}</div>}

      {loading && campanhas.length === 0 ? (
        <div className="aprovar-vazio">Carregando campanhas pendentes...</div>
      ) : campanhas.length === 0 ? (
        <div className="aprovar-vazio">
          <p>Nenhuma campanha pendente de aprovação no momento.</p>
        </div>
      ) : (
        <div className="aprovar-lista">
          {campanhas.map((campanha) => (
            <div key={campanha.id} className="aprovar-card">
              {campanha.imagem && (
                <img
                  src={campanha.imagem}
                  alt={campanha.titulo}
                  className="aprovar-card-imagem"
                />
              )}

              <div className="aprovar-card-conteudo">
                <div className="aprovar-card-topo">
                  <h3>{campanha.titulo}</h3>
                  <span className="badge-pendente">Pendente</span>
                </div>

                <p className="aprovar-descricao">{campanha.descricao}</p>

                <div className="aprovar-meta">
                  <span><strong>Criador:</strong> {campanha.criador?.nome || '-'}</span>
                  <span><strong>Categoria:</strong> {campanha.categoria?.nome || '-'}</span>
                  <span><strong>Cidade:</strong> {campanha.cidade?.nome || '-'}</span>
                  <span><strong>Período:</strong> {formatarData(campanha.data_inicio)} a {formatarData(campanha.data_fim)}</span>
                </div>

                <div className="aprovar-acoes">
                  <Link to={`/campanhas/${campanha.id}`} className="btn-ver-detalhes-aprovar">
                    Ver detalhes completos
                  </Link>
                  <div className="aprovar-botoes-decisao">
                    <button
                      className="btn-reprovar"
                      onClick={() => handleDecisao(campanha, false)}
                      disabled={processandoId === campanha.id}
                    >
                      ✕ Reprovar
                    </button>
                    <button
                      className="btn-aprovar"
                      onClick={() => handleDecisao(campanha, true)}
                      disabled={processandoId === campanha.id}
                    >
                      {processandoId === campanha.id ? 'Processando...' : '✓ Aprovar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AprovarCampanhas;
