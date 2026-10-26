import React, { useState, useEffect } from 'react';
import api from '../../controllers/services/api';
import './CadastrarCampanha.css';

/**
 * Componente de Cadastro/Edição de Campanha.
 *
 * Modo CRIAÇÃO (padrão): usado dentro da página de Perfil.
 *   <CadastrarCampanha usuarioId={user.id} onCampanhaCreated={...} />
 *
 * Modo EDIÇÃO: passe a campanha existente em `campanhaParaEditar`.
 * Nesse modo o formulário já vem aberto e pré-preenchido, o submit
 * faz PUT em vez de POST, e os botões/textos mudam para refletir edição.
 *   <CadastrarCampanha
 *      usuarioId={user.id}
 *      campanhaParaEditar={campanha}
 *      onCampanhaUpdated={...}
 *      onCancelEdit={...}
 *   />
 */
const CadastrarCampanha = ({
  usuarioId,
  onCampanhaCreated,
  campanhaParaEditar = null,
  onCampanhaUpdated,
  onCancelEdit
}) => {
  const modoEdicao = !!campanhaParaEditar;

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
  const [imagemArquivo, setImagemArquivo] = useState(null);
  const [imagemPreview, setImagemPreview] = useState(campanhaParaEditar?.imagem || null);
  // Galeria de fotos (além da capa): fotos que já existiam (modo edição,
  // vêm com id pra permitir excluir) + fotos novas ainda não enviadas.
  const [galeriaExistente, setGaleriaExistente] = useState(campanhaParaEditar?.imagens || []);
  const [galeriaNovaArquivos, setGaleriaNovaArquivos] = useState([]);
  const [galeriaNovaPreviews, setGaleriaNovaPreviews] = useState([]);
  const [removendoGaleriaId, setRemovendoGaleriaId] = useState(null);
  const MAX_FOTOS_GALERIA = 6;
  // No modo edição o formulário já começa aberto
  const [expandeForm, setExpandeForm] = useState(modoEdicao);

  // Formata uma data ISO (ex: "2026-07-01T00:00:00.000Z") para o formato
  // que o <input type="date"> espera (yyyy-MM-dd)
  const paraInputDate = (data) => {
    if (!data) return '';
    return new Date(data).toISOString().split('T')[0];
  };

  useEffect(() => {
    carregarFiltros();
  }, []);

  // Pré-popula o formulário quando entra em modo edição
  // (ou quando a campanha a editar é trocada)
  useEffect(() => {
    if (campanhaParaEditar) {
      const infos = campanhaParaEditar.informacoes || {};
      setFormData({
        titulo: campanhaParaEditar.titulo || '',
        descricao: campanhaParaEditar.descricao || '',
        categoria_id: campanhaParaEditar.categoria?.id || campanhaParaEditar.categoria_id || '',
        cidade_id: campanhaParaEditar.cidade?.id || campanhaParaEditar.cidade_id || '',
        data_inicio: paraInputDate(campanhaParaEditar.data_inicio),
        data_fim: paraInputDate(campanhaParaEditar.data_fim),
        meta_participantes: campanhaParaEditar.meta_participantes || '',
        objetivos: infos.objetivos || '',
        publico_alvo: infos.publico_alvo || '',
        impacto_esperado: infos.impacto_esperado || '',
        regras: infos.regras || '',
        observacoes: infos.observacoes || ''
      });
      setExpandeForm(true);
      setGaleriaExistente(campanhaParaEditar.imagens || []);

      // Se a cidade já vier com o estado embutido, usa para já
      // carregar a lista de cidades certa no select
      if (campanhaParaEditar.cidade?.estado_id) {
        setEstadoSelecionado(campanhaParaEditar.cidade.estado_id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campanhaParaEditar]);

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

      if (catData?.data) {
        setCategorias(catData.data);
      }
      
      if (estData?.dados) {
        setEstados(estData.dados);
      } else if (estData?.data) {
        setEstados(estData.data);
      }
    } catch (err) {
      console.error('Erro ao carregar filtros:', err);
    }
  };

  const carregarCidadesDoEstado = async (estadoId) => {
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
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImagemChange = (e) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    if (!tiposPermitidos.includes(arquivo.type)) {
      setError('Formato de imagem inválido. Envie um arquivo .jpg, .jpeg, .png ou .webp');
      e.target.value = '';
      return;
    }
    if (arquivo.size > 5 * 1024 * 1024) {
      setError('Imagem muito grande. Tamanho máximo: 5MB');
      e.target.value = '';
      return;
    }

    setError('');
    setImagemArquivo(arquivo);
    setImagemPreview(URL.createObjectURL(arquivo));
  };

  // Seleção de várias fotos para a galeria de uma vez. Valida cada arquivo
  // e respeita o limite total (existentes + já selecionadas + novas).
  const handleGaleriaChange = (e) => {
    const arquivosSelecionados = Array.from(e.target.files || []);
    if (arquivosSelecionados.length === 0) return;

    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    const totalAtual = galeriaExistente.length + galeriaNovaArquivos.length;

    if (totalAtual + arquivosSelecionados.length > MAX_FOTOS_GALERIA) {
      setError(`Limite de ${MAX_FOTOS_GALERIA} fotos na galeria (você já tem ${totalAtual}).`);
      e.target.value = '';
      return;
    }

    const arquivosValidos = [];
    for (const arquivo of arquivosSelecionados) {
      if (!tiposPermitidos.includes(arquivo.type)) {
        setError(`"${arquivo.name}" tem formato inválido. Envie apenas .jpg, .jpeg, .png ou .webp`);
        e.target.value = '';
        return;
      }
      if (arquivo.size > 5 * 1024 * 1024) {
        setError(`"${arquivo.name}" é muito grande. Tamanho máximo: 5MB`);
        e.target.value = '';
        return;
      }
      arquivosValidos.push(arquivo);
    }

    setError('');
    setGaleriaNovaArquivos(prev => [...prev, ...arquivosValidos]);
    setGaleriaNovaPreviews(prev => [
      ...prev,
      ...arquivosValidos.map(arquivo => URL.createObjectURL(arquivo))
    ]);
    e.target.value = '';
  };

  // Remove uma foto nova (ainda não enviada) antes do submit.
  const handleRemoverGaleriaNova = (indice) => {
    setGaleriaNovaPreviews(prev => {
      URL.revokeObjectURL(prev[indice]);
      return prev.filter((_, i) => i !== indice);
    });
    setGaleriaNovaArquivos(prev => prev.filter((_, i) => i !== indice));
  };

  // Remove uma foto que já estava salva na galeria (só existe em modo
  // edição). Exclui direto no servidor, já que a foto já foi persistida.
  const handleRemoverGaleriaExistente = async (imagem) => {
    if (!modoEdicao) return;
    if (!window.confirm('Remover esta foto da galeria?')) return;

    setRemovendoGaleriaId(imagem.id);
    try {
      await api.delete(`/projetos/${campanhaParaEditar.id}/imagens/${imagem.id}`);
      setGaleriaExistente(prev => prev.filter(img => img.id !== imagem.id));
    } catch (err) {
      console.error('Erro ao remover foto da galeria:', err);
      setError('Erro ao remover a foto. Tente novamente.');
    } finally {
      setRemovendoGaleriaId(null);
    }
  };

  // Envia as fotos novas da galeria pro projeto já criado/atualizado.
  // Assim como a capa, não bloqueia o fluxo principal se falhar.
  const enviarGaleriaSePresente = async (projetoId) => {
    if (galeriaNovaArquivos.length === 0) return;
    try {
      const formDataGaleria = new FormData();
      galeriaNovaArquivos.forEach(arquivo => formDataGaleria.append('imagens', arquivo));
      await api.uploadFile(`/projetos/${projetoId}/imagens`, formDataGaleria);
      galeriaNovaPreviews.forEach(url => URL.revokeObjectURL(url));
      setGaleriaNovaArquivos([]);
      setGaleriaNovaPreviews([]);
    } catch (err) {
      console.error('Erro ao enviar fotos da galeria:', err);
      setError('Campanha salva, mas houve um erro ao enviar as fotos da galeria. Tente novamente na edição.');
    }
  };

  // Envia a imagem selecionada pro projeto já criado/atualizado.
  // Não bloqueia o fluxo principal se falhar - a campanha em si já foi
  // salva com sucesso, só a imagem que não subiu.
  const enviarImagemSePresente = async (projetoId) => {
    if (!imagemArquivo) return;
    try {
      const formDataImagem = new FormData();
      formDataImagem.append('imagem', imagemArquivo);
      await api.uploadFile(`/projetos/${projetoId}/imagem`, formDataImagem);
    } catch (err) {
      console.error('Erro ao enviar imagem da campanha:', err);
      setError('Campanha salva, mas houve um erro ao enviar a imagem. Tente enviar novamente na edição.');
    }
  };

  const handleEstadoChange = (e) => {
    const { value } = e.target;
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

      if (modoEdicao) {
        // ===== MODO EDIÇÃO: PUT no projeto existente =====
        await api.put(`/projetos/${campanhaParaEditar.id}`, {
          titulo: formData.titulo,
          descricao: formData.descricao,
          categoria_id: parseInt(formData.categoria_id),
          cidade_id: parseInt(formData.cidade_id),
          data_inicio: formData.data_inicio,
          data_fim: formData.data_fim,
          meta_participantes: formData.meta_participantes ? parseInt(formData.meta_participantes) : null
        });

        // Atualiza (ou cria) as informações detalhadas da campanha
        if (formData.objetivos || formData.publico_alvo || formData.impacto_esperado ||
            formData.regras || formData.observacoes) {
          await api.post('/info-campanha', {
            projeto_id: campanhaParaEditar.id,
            objetivos: formData.objetivos || null,
            publico_alvo: formData.publico_alvo || null,
            impacto_esperado: formData.impacto_esperado || null,
            regras: formData.regras || null,
            observacoes: formData.observacoes || null
          });
        }

        setSuccess('Campanha atualizada com sucesso!');
        await enviarImagemSePresente(campanhaParaEditar.id);
        await enviarGaleriaSePresente(campanhaParaEditar.id);

        setTimeout(() => {
          if (onCampanhaUpdated) onCampanhaUpdated();
        }, 1200);

        return;
      }

      // ===== MODO CRIAÇÃO: POST de um novo projeto =====
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

      setSuccess('Campanha criada com sucesso! Ela ficará visível ao público após aprovação de um administrador.');
      await enviarImagemSePresente(projetoId);
      await enviarGaleriaSePresente(projetoId);

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
      setImagemArquivo(null);
      setImagemPreview(null);
      setGaleriaExistente([]);
      setGaleriaNovaArquivos([]);
      setGaleriaNovaPreviews([]);
      setExpandeForm(false);

      setTimeout(() => {
        if (onCampanhaCreated) onCampanhaCreated();
      }, 2000);
    } catch (err) {
      console.error(modoEdicao ? 'Erro ao atualizar campanha:' : 'Erro ao criar campanha:', err);
      setError(err.message || (modoEdicao ? 'Erro ao atualizar campanha' : 'Erro ao criar campanha'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    if (modoEdicao) {
      if (onCancelEdit) onCancelEdit();
      return;
    }
    setExpandeForm(false);
  };

  return (
    <div className="cadastrar-campanha-container">
      <div className="cadastrar-header">
        <h2>{modoEdicao ? 'Editar Campanha' : 'Cadastre sua Campanha'}</h2>
        <p>{modoEdicao ? 'Atualize as informações da sua campanha' : 'Compartilhe sua iniciativa e engaje a comunidade'}</p>
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

            <div className="form-group">
              <label htmlFor="imagem">Imagem de Capa (opcional)</label>
              {imagemPreview && (
                <img
                  src={imagemPreview}
                  alt="Prévia da imagem"
                  style={{
                    width: '100%',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '10px'
                  }}
                />
              )}
              <input
                type="file"
                id="imagem"
                name="imagem"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImagemChange}
              />
              <small style={{ color: '#888', display: 'block', marginTop: '4px' }}>
                Formatos aceitos: JPG, PNG ou WEBP. Tamanho máximo: 5MB.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="galeria">
                Galeria de Fotos (opcional) — até {MAX_FOTOS_GALERIA} fotos, aparecem na página da campanha
              </label>

              {(galeriaExistente.length > 0 || galeriaNovaPreviews.length > 0) && (
                <div className="galeria-preview-grid">
                  {galeriaExistente.map((imagem) => (
                    <div key={`existente-${imagem.id}`} className="galeria-preview-item">
                      <img src={imagem.caminho} alt="Foto da galeria" />
                      <button
                        type="button"
                        className="galeria-preview-remover"
                        onClick={() => handleRemoverGaleriaExistente(imagem)}
                        disabled={removendoGaleriaId === imagem.id}
                        title="Remover foto"
                      >
                        {removendoGaleriaId === imagem.id ? '...' : '×'}
                      </button>
                    </div>
                  ))}
                  {galeriaNovaPreviews.map((url, indice) => (
                    <div key={`nova-${url}`} className="galeria-preview-item galeria-preview-nova">
                      <img src={url} alt="Nova foto da galeria" />
                      <button
                        type="button"
                        className="galeria-preview-remover"
                        onClick={() => handleRemoverGaleriaNova(indice)}
                        title="Remover foto"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input
                type="file"
                id="galeria"
                name="galeria"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleGaleriaChange}
                disabled={galeriaExistente.length + galeriaNovaArquivos.length >= MAX_FOTOS_GALERIA}
              />
              <small style={{ color: '#888', display: 'block', marginTop: '4px' }}>
                Você pode selecionar várias fotos de uma vez. Restam{' '}
                {Math.max(0, MAX_FOTOS_GALERIA - galeriaExistente.length - galeriaNovaArquivos.length)} vaga(s).
              </small>
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
              {loading
                ? (modoEdicao ? 'Salvando...' : 'Criando...')
                : (modoEdicao ? 'Salvar Alterações' : 'Criar Campanha')}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCancelar}
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