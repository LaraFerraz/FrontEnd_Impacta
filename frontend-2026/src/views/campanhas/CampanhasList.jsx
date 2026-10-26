import React, { useState, useEffect, useCallback } from 'react';
import api from '../../controllers/services/api';
import { useToast } from '../../controllers/hooks/useToast';
import Toast from '../components/Toast';
import CampanhaCard from './CampanhaCard';
import './CampanhasList.css';

const CampanhasList = () => {
  const { toasts, showError, removeToast } = useToast();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [campanhas, setCampanhas] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, total_paginas: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({
    categoria_id: '',
    status_id: '',
    cidade_id: ''
  });
  const [categorias, setCategorias] = useState([]);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState('');

  // Carregar campanhas
  const carregarCampanhas = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams({
        page,
        limit,
        ...Object.fromEntries(Object.entries(filtros).filter(([, v]) => v))
      });

      const response = await api.get(`/projetos?${params.toString()}`);
      
      if (response && response.data) {
        setCampanhas(response.data);
        setPagination(response.pagination || { total: 0, total_paginas: 1 });
      }
    } catch (err) {
      console.error('Erro ao carregar campanhas:', err);
      const errorMsg = 'Erro ao carregar campanhas. Tente novamente.';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [page, filtros, showError]);

  useEffect(() => {
    carregarCampanhas();
  }, [carregarCampanhas]);

  // Carregar dados de filtros
  const carregarFiltros = useCallback(async () => {
    try {
      const [catData, estData] = await Promise.all([
        api.get('/categorias'),
        api.get('/estados/todos')
      ]);

      if (catData && catData.data) {
        setCategorias(catData.data);
      }
      
      if (estData?.dados) {
        setEstados(estData.dados);
      } else if (estData?.data) {
        setEstados(estData.data);
      }
    } catch (err) {
      console.error('Erro ao carregar filtros:', err);
      showError('Erro ao carregar filtros');
    }
  }, [showError]);

  // Carregar cidades quando estado de filtro é selecionado
  const carregarCidadesDoEstado = useCallback(async (estadoId) => {
    try {
      const response = await api.get(`/cidades/estado/${estadoId}`);
      
      if (response?.data) {
        setCidades(response.data);
      } else if (Array.isArray(response)) {
        setCidades(response);
      }
    } catch (err) {
      console.error('Erro ao carregar cidades:', err);
      setCidades([]);
      showError('Erro ao carregar cidades');
    }
  }, [showError]);

  // Efetuar apenas uma vez ao montar o componente
  useEffect(() => {
    carregarFiltros();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Carregar cidades quando estado de filtro é selecionado
  useEffect(() => {
    if (estadoFiltro) {
      carregarCidadesDoEstado(estadoFiltro);
    } else {
      setCidades([]);
      setFiltros(prev => ({ ...prev, cidade_id: '' }));
    }
  }, [estadoFiltro, carregarCidadesDoEstado]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1);
  };

  const handleEstadoFiltroChange = (e) => {
    const { value } = e.target;
    setEstadoFiltro(value);
  };

  const handleLimparFiltros = () => {
    setFiltros({
      categoria_id: '',
      status_id: '',
      cidade_id: ''
    });
    setEstadoFiltro('');
    setCidades([]);
    setPage(1);
  };

  return (
    <div className="campanhas-list-container">
      <div className="campanhas-header">
        <h2>Campanhas Disponíveis</h2>
        <p className="total-campanhas">Total: {pagination.total} campanhas</p>
      </div>

      {/* Filtros */}
      <div className="filtros-section">
        <h3>Filtrar Campanhas</h3>
        <div className="filtros-grid">
          <div className="filtro-group">
            <label htmlFor="categoria">Categoria</label>
            <select
              id="categoria"
              name="categoria_id"
              value={filtros.categoria_id}
              onChange={handleFiltroChange}
            >
              <option value="">Todas as categorias</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </select>
          </div>

          <div className="filtro-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status_id"
              value={filtros.status_id}
              onChange={handleFiltroChange}
            >
              <option value="">Todos os status</option>
              <option value="1">Planejamento</option>
              <option value="2">Em Andamento</option>
              <option value="3">Concluída</option>
              <option value="4">Cancelada</option>
            </select>
          </div>

          <div className="filtro-group">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado_id"
              value={estadoFiltro}
              onChange={handleEstadoFiltroChange}
            >
              <option value="">Todos os estados</option>
              {estados.map(est => (
                <option key={est.id} value={est.id}>{est.nome}</option>
              ))}
            </select>
          </div>

          <div className="filtro-group">
            <label htmlFor="cidade">Cidade</label>
            <select
              id="cidade"
              name="cidade_id"
              value={filtros.cidade_id}
              onChange={handleFiltroChange}
              disabled={!estadoFiltro}
            >
              <option value="">
                {estadoFiltro ? 'Todas as cidades' : 'Selecione um estado primeiro'}
              </option>
              {cidades.map(cidade => (
                <option key={cidade.id} value={cidade.id}>{cidade.nome}</option>
              ))}
            </select>
          </div>

          <button className="btn-limpar-filtros" onClick={handleLimparFiltros}>
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Loading e Erro */}
      {loading && <div className="loading">Carregando campanhas...</div>}
      {error && <div className="error">{error}</div>}

      {/* Lista de Campanhas */}
      {!loading && campanhas.length > 0 ? (
        <>
          <div className="campanhas-grid">
            {campanhas.map(campanha => (
              <CampanhaCard key={campanha.id} campanha={campanha} />
            ))}
          </div>

          {/* Paginação */}
          {pagination.total_paginas > 1 && (
            <div className="paginacao">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="btn-paginacao"
              >
                ← Anterior
              </button>

              <div className="paginas-info">
                Página {page} de {pagination.total_paginas}
              </div>

              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.total_paginas}
                className="btn-paginacao"
              >
                Próxima →
              </button>
            </div>
          )}
        </>
      ) : (
        !loading && <div className="no-results">Nenhuma campanha encontrada com os filtros selecionados.</div>
      )}
      
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default CampanhasList;
