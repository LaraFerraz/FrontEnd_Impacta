import React, { useState, useEffect } from 'react';
import api from '../../controllers/services/api';
import './CadastrarCampanha.css';

const CadastrarCampanha = ({ usuarioId, onCampanhaCreated }) => {
  const [formData, setFormData] = useState({
    // Projeto
    titulo: '',
    descricao: '',
    categoria_id: '',
    cidade_id: '',
    data_inicio: '',
    data_fim: '',
    meta_participantes: '',
    // Info_campanha
    objetivos: '',
    publico_alvo: '',
    impacto_esperado: '',
    regras: '',
    observacoes: ''
  });

  const [categorias, setCategorias] = useState([]);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandeForm, setExpandeForm] = useState(false);

  useEffect(() => {
    carregarFiltros();
  }, []);

  // Carregar cidades quando estado é selecionado
  useEffect(() => {
    if (estadoSelecionado) {
      carregarCidadesDoEstado(estadoSelecionado);
    } else {
      setCidades([]);
      setFormData(prev => ({ ...prev, cidade_id: '' }));
    }
  }, [estadoSelecionado]);

  const carregarFiltros = async () => {
    try {
      const [catData, estData] = await Promise.all([
        api.get('/categorias'),
        api.get('/estados/todos')
      ]);

      console.log('📊 Resposta Categorias:', catData);
      console.log('📊 Resposta Estados:', estData);

      if (catData?.data) {
        console.log('✅ Categorias carregadas:', catData.data);
        setCategorias(catData.data);
      } else {
        console.warn('⚠️ Nenhuma data em catData:', catData);
      }
      
      if (estData?.dados) {
        console.log('✅ Estados carregados:', estData.dados);
        setEstados(estData.dados);
      } else if (estData?.data) {
        console.log('✅ Estados carregados:', estData.data);
        setEstados(estData.data);
      } else {
        console.warn('⚠️ Nenhuma data em estData:', estData);
      }
    } catch (err) {
      console.error('❌ Erro ao carregar filtros:', err);
    }
  };

  const carregarCidadesDoEstado = async (estadoId) => {
    try {
      const response = await api.get(`/cidades/estado/${estadoId}`);
      console.log('📊 Cidades do estado:', response.data || response);
      
      if (response?.data) {
        setCidades(response.data);
      } else if (Array.isArray(response)) {
        setCidades(response);
      }
    } catch (err) {
      console.error('❌ Erro ao carregar cidades:', err);
      setCidades([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEstadoChange = (e) => {
    const { value } = e.target;
    console.log('🔄 Estado selecionado:', value);
    setEstadoSelecionado(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validações
      if (!formData.titulo || !formData.descricao || !formData.categoria_id || 
          !formData.cidade_id || !formData.data_inicio || !formData.data_fim) {
        setError('Preencha todos os campos obrigatórios');
        setLoading(false);
        return;
      }

      // Criar Projeto
      const projetoResponse = await api.post('/projetos', {
        titulo: formData.titulo,
        descricao: formData.descricao,
        categoria_id: parseInt(formData.categoria_id),
        criador_id: usuarioId,
        cidade_id: parseInt(formData.cidade_id),
        data_inicio: formData.data_inicio,
        data_fim: formData.data_fim,
        meta_participantes: formData.meta_participantes ? parseInt(formData.meta_participantes) : null,
        status_id: 1 // Planejamento
      });

      if (!projetoResponse?.data?.id) {
        throw new Error('Erro ao criar projeto');
      }

      const projetoId = projetoResponse.data.id;

      // Criar Info_campanha (opcional)
      if (formData.objetivos || formData.publico_alvo || formData.impacto_esperado || 
          formData.regras || formData.observacoes) {
        
        await api.post('/info-campanha', {
          projeto_id: projetoId,
          objetivos: formData.objetivos || null,
          publico_alvo: formData.publico_alvo || null,
          impacto_esperado: formData.impacto_esperado || null,
          regras: formData.regras || null,
          observacoes: formData.observacoes || null
        });
      }

      setSuccess('Campanha criada com sucesso!');
      setFormData({
        titulo: '',
        descricao: '',
        categoria_id: '',
        cidade_id: '',
        data_inicio: '',
        data_fim: '',
        meta_participantes: '',
        objetivos: '',
        publico_alvo: '',
        impacto_esperado: '',
        regras: '',
        observacoes: ''
      });
      setExpandeForm(false);

      setTimeout(() => {
        if (onCampanhaCreated) onCampanhaCreated();
      }, 2000);
    } catch (err) {
      console.error('Erro ao criar campanha:', err);
      setError(err.message || 'Erro ao criar campanha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastrar-campanha-container">
      <div className="cadastrar-header">
        <h2>📢 Cadastre sua Campanha</h2>
        <p>Compartilhe sua iniciativa e engaje a comunidade</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {!expandeForm ? (
        <button 
          className="btn-novo-projeto"
          onClick={() => setExpandeForm(true)}
        >
          + Nova Campanha
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="form-campanha">
          {/* Seção 1: Informações Básicas */}
          <fieldset className="form-section">
            <legend>Informações Básicas</legend>

            <div className="form-group">
              <label htmlFor="titulo">Título da Campanha *</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ex: Limpeza do Parque Central"
                maxLength={150}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="descricao">Descrição *</label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Descreva os detalhes da sua campanha..."
                rows="4"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="categoria_id">Categoria *</label>
                <select
                  id="categoria_id"
                  name="categoria_id"
                  value={formData.categoria_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="estado_id">Estado *</label>
                <select
                  id="estado_id"
                  name="estado_id"
                  value={estadoSelecionado}
                  onChange={handleEstadoChange}
                  required
                >
                  <option value="">Selecione um estado</option>
                  {estados.map(est => (
                    <option key={est.id} value={est.id}>{est.nome}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="cidade_id">Cidade *</label>
                <select
                  id="cidade_id"
                  name="cidade_id"
                  value={formData.cidade_id}
                  onChange={handleChange}
                  required
                  disabled={!estadoSelecionado}
                >
                  <option value="">
                    {estadoSelecionado ? 'Selecione uma cidade' : 'Selecione um estado primeiro'}
                  </option>
                  {cidades.map(cidade => (
                    <option key={cidade.id} value={cidade.id}>{cidade.nome}</option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          {/* Seção 2: Datas e Meta */}
          <fieldset className="form-section">
            <legend>Período e Meta</legend>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="data_inicio">Data de Início *</label>
                <input
                  type="date"
                  id="data_inicio"
                  name="data_inicio"
                  value={formData.data_inicio}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="data_fim">Data de Término *</label>
                <input
                  type="date"
                  id="data_fim"
                  name="data_fim"
                  value={formData.data_fim}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="meta_participantes">Meta de Participantes</label>
                <input
                  type="number"
                  id="meta_participantes"
                  name="meta_participantes"
                  value={formData.meta_participantes}
                  onChange={handleChange}
                  placeholder="Ex: 50"
                  min="1"
                />
              </div>
            </div>
          </fieldset>

          {/* Seção 3: Informações Detalhadas */}
          <fieldset className="form-section">
            <legend>Informações Detalhadas (Opcional)</legend>

            <div className="form-group">
              <label htmlFor="objetivos">Objetivos</label>
              <textarea
                id="objetivos"
                name="objetivos"
                value={formData.objetivos}
                onChange={handleChange}
                placeholder="Quais são os objetivos da campanha?"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="publico_alvo">Público Alvo</label>
              <textarea
                id="publico_alvo"
                name="publico_alvo"
                value={formData.publico_alvo}
                onChange={handleChange}
                placeholder="Quem você quer atingir com essa campanha?"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="impacto_esperado">Impacto Esperado</label>
              <textarea
                id="impacto_esperado"
                name="impacto_esperado"
                value={formData.impacto_esperado}
                onChange={handleChange}
                placeholder="Qual é o impacto esperado?"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="regras">Regras</label>
              <textarea
                id="regras"
                name="regras"
                value={formData.regras}
                onChange={handleChange}
                placeholder="Quais são as regras da campanha?"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="observacoes">Observações</label>
              <textarea
                id="observacoes"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                placeholder="Outras informações importantes..."
                rows="3"
              />
            </div>
          </fieldset>

          {/* Botões */}
          <div className="form-buttons">
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Criando...' : 'Criar Campanha'}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setExpandeForm(false)}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CadastrarCampanha;
