import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../controllers/services/api';
import { useToast } from '../../controllers/hooks/useToast';
import CadastrarCampanha from './CadastrarCampanha';
import './MinhasCampanhasInscritas.css';
import './MinhasCampanhasCriadas.css';

/**
 * Lista as campanhas criadas pelo próprio usuário, com opção
 * de editar (formulário inline, reaproveitando CadastrarCampanha
 * em modo edição) ou excluir cada campanha.
 */
const MinhasCampanhasCriadas = ({ usuarioId, refreshTrigger = 0 }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [campanhas, setCampanhas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [campanhaEditando, setCampanhaEditando] = useState(null);
  const [excluindoId, setExcluindoId] = useState(null);
  const limit = 10;

  const carregarCampanhas = useCallback(async () => {
    if (!usuarioId) return;

    setLoading(true);
    setErro('');

    try {
      const response = await api.get(
        `/projetos?criador_id=${usuarioId}&page=${page}&limit=${limit}`
      );

      if (response && response.data) {
        setCampanhas(response.data);
        setTotal(response.pagination?.total || 0);
        setTotalPaginas(response.pagination?.total_paginas || 1);
      }
    } catch (error) {
      console.error('Erro ao carregar minhas campanhas:', error);
      setErro('Erro ao carregar suas campanhas criadas');
      setCampanhas([]);
    } finally {
      setLoading(false);
    }
  }, [usuarioId, page]);

  // Recarrega quando a página muda OU quando o componente pai
  // sinaliza (via refreshTrigger) que uma campanha nova foi criada
  useEffect(() => {
    carregarCampanhas();
  }, [carregarCampanhas, refreshTrigger]);

  const formatarData = (data) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (statusNome) => {
    const statusMap = {
      'Planejamento': '#FFA500',
      'Em Andamento': '#4CAF50',
      'Concluída': '#2196F3',
      'Cancelada': '#F44336'
    };
    return statusMap[statusNome] || '#999';
  };

  const handleExcluir = async (campanha) => {
    if (!window.confirm(`Tem certeza que deseja excluir a campanha "${campanha.titulo}"? Essa ação não pode ser desfeita.`)) {
      return;
    }

    setExcluindoId(campanha.id);
    try {
      await api.delete(`/projetos/${campanha.id}`);
      showToast('Campanha excluída com sucesso', 'success');
      await carregarCampanhas();
    } catch (error) {
      console.error('Erro ao excluir campanha:', error);
      showToast(error.message || 'Erro ao excluir a campanha', 'error');
    } finally {
      setExcluindoId(null);
    }
  };

  const handleCampanhaAtualizada = async () => {
    setCampanhaEditando(null);
    showToast('Campanha atualizada com sucesso!', 'success');
    await carregarCampanhas();
  };

  // Enquanto uma campanha está em edição, mostra só o formulário dela
  if (campanhaEditando) {
    return (
      <div className="minhas-campanhas-container">
        <button
          onClick={() => setCampanhaEditando(null)}
          className="btn-voltar-edicao"
        >
          ← Voltar para minhas campanhas
        </button>
        <CadastrarCampanha
          usuarioId={usuarioId}
          campanhaParaEditar={campanhaEditando}
          onCampanhaUpdated={handleCampanhaAtualizada}
          onCancelEdit={() => setCampanhaEditando(null)}
        />
      </div>
    );
  }

  if (loading && campanhas.length === 0) {
    return (
      <div className="minhas-campanhas-container">
        <h2>Minhas Campanhas Criadas</h2>
        <div className="loading-message">Carregando suas campanhas...</div>
      </div>
    );
  }

  if (erro && campanhas.length === 0) {
    return (
      <div className="minhas-campanhas-container">
        <h2>Minhas Campanhas Criadas</h2>
        <div className="erro-message">{erro}</div>
      </div>
    );
  }

  return (
    <div className="minhas-campanhas-container">
      <div className="minhas-campanhas-header">
        <h2> Minhas Campanhas Criadas</h2>
        <p className="subtitulo">Gerencie as campanhas que você criou — total: {total}</p>
      </div>

      {campanhas.length === 0 ? (
        <div className="sem-campanhas">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <p>Você ainda não criou nenhuma campanha</p>
        </div>
      ) : (
        <>
          <div className="campanhas-grid">
            {campanhas.map((campanha) => (
              <div key={campanha.id} className="campanha-inscrita-card">
                <div className="card-header">
                  <h3>{campanha.titulo}</h3>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(campanha.status?.nome) }}
                  >
                    {campanha.status?.nome || 'Sem status'}
                  </span>
                </div>

                <p className="descricao">
                  {campanha.descricao
                    ? `${campanha.descricao.substring(0, 100)}...`
                    : 'Sem descrição'}
                </p>

                <div className="card-info">
                  <div className="info-item">
                    <span className="label">Categoria:</span>
                    <span className="value">{campanha.categoria?.nome || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Cidade:</span>
                    <span className="value">{campanha.cidade?.nome || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Término:</span>
                    <span className="value">{formatarData(campanha.data_fim)}</span>
                  </div>
                </div>

                <div className="campanha-criada-acoes">
                  <button
                    onClick={() => navigate(`/campanhas/${campanha.id}`)}
                    className="btn-ver-detalhes"
                  >
                    Ver Detalhes
                  </button>
                  <button
                    onClick={() => setCampanhaEditando(campanha)}
                    className="btn-editar-card"
                  >
                     Editar
                  </button>
                  <button
                    onClick={() => handleExcluir(campanha)}
                    disabled={excluindoId === campanha.id}
                    className="btn-excluir-card"
                  >
                    {excluindoId === campanha.id ? 'Excluindo...' : '🗑️ Excluir'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPaginas > 1 && (
            <div className="paginacao">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
                className="btn-pagina"
              >
                ← Anterior
              </button>

              <div className="paginas-info">
                Página {page} de {totalPaginas}
              </div>

              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page === totalPaginas}
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

export default MinhasCampanhasCriadas;