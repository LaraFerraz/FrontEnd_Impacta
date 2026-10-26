import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import participacoesService from '../../controllers/services/participacoesService';
import './MinhasCampanhasInscritas.css';

const MinhasCampanhasInscritas = ({ usuarioId }) => {
  const navigate = useNavigate();
  const [campanhas, setCampanhas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    carregarCampanhas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, usuarioId]);

  const carregarCampanhas = async () => {
    setLoading(true);
    setErro('');
    
    try {
      const resultado = await participacoesService.obterCampanhasDoUsuario(
        usuarioId,
        page,
        limit
      );

      if (resultado.sucesso) {
        setCampanhas(resultado.dados || []);
        setTotal(resultado.paginacao?.total || 0);
      } else {
        setErro(resultado.mensagem || 'Erro ao carregar campanhas');
        setCampanhas([]);
      }
    } catch (error) {
      console.error('Erro ao carregar campanhas:', error);
      setErro('Erro ao carregar suas campanhas');
      setCampanhas([]);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (statusNome) => {
    const statusMap = {
      'Pendente': '#FFA500',
      'Confirmada': '#4CAF50',
      'Cancelada': '#F44336'
    };
    return statusMap[statusNome] || '#999';
  };

  const totalPages = Math.ceil(total / limit);

  if (loading && campanhas.length === 0) {
    return (
      <div className="minhas-campanhas-container">
        <h2>Minhas Campanhas</h2>
        <div className="loading-message">Carregando suas campanhas...</div>
      </div>
    );
  }

  if (erro && campanhas.length === 0) {
    return (
      <div className="minhas-campanhas-container">
        <h2>Minhas Campanhas</h2>
        <div className="erro-message">{erro}</div>
      </div>
    );
  }

  return (
    <div className="minhas-campanhas-container">
      <div className="minhas-campanhas-header">
        <h2>📋 Minhas Campanhas Inscritas</h2>
        <p className="subtitulo">Acompanhe as campanhas em que você está participando</p>
      </div>

      {campanhas.length === 0 ? (
        <div className="sem-campanhas">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 1 0 4 0m0 0a2 2 0 1 0-4 0" />
          </svg>
          <p>Você ainda não se inscreveu em nenhuma campanha</p>
          <button 
            onClick={() => navigate('/campanhas')}
            className="btn-explorar"
          >
            Explorar Campanhas
          </button>
        </div>
      ) : (
        <>
          <div className="campanhas-grid">
            {campanhas.map((inscricao) => {
              const projeto = inscricao.projeto;
              return (
                <div key={inscricao.id} className="campanha-inscrita-card">
                  <div className="card-header">
                    <h3>{projeto.titulo}</h3>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(inscricao.status.nome) }}
                    >
                      {inscricao.status.nome}
                    </span>
                  </div>

                  <p className="descricao">{projeto.descricao?.substring(0, 100)}...</p>

                  <div className="card-info">
                    <div className="info-item">
                      <span className="label">Criador:</span>
                      <span className="value">{projeto.criador.nome}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Categoria:</span>
                      <span className="value">{projeto.categoria.nome}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Data de Inscrição:</span>
                      <span className="value">{formatarData(inscricao.data_inscricao)}</span>
                    </div>
                    {projeto.data_fim && (
                      <div className="info-item">
                        <span className="label">Término:</span>
                        <span className="value">{formatarData(projeto.data_fim)}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/campanhas/${projeto.id}`)}
                    className="btn-ver-detalhes"
                  >
                    Ver Detalhes
                  </button>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="paginacao">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="btn-pagina"
              >
                ← Anterior
              </button>

              <div className="paginas-info">
                Página {page} de {totalPages}
              </div>

              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="btn-pagina"
              >
                Próxima →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MinhasCampanhasInscritas;
