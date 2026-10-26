import React, { useState, useEffect } from 'react';
import api from '../../controllers/services/api';
import { useToast } from '../../controllers/hooks/useToast';
import { useAuth } from '../../controllers/contexts/AuthContext';
import './Categorias.css';

const Categorias = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const ehAdmin = user?.tipo?.id === 1 || user?.tipo?.nome === 'Admin';

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  // Formulário
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null); // null = criação, objeto = edição
  const [nomeInput, setNomeInput] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [excluindoId, setExcluindoId] = useState(null);

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    setLoading(true);
    setErro('');
    try {
      const response = await api.get('/categorias');
      setCategorias(response?.data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setErro('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const abrirFormCriacao = () => {
    setEditando(null);
    setNomeInput('');
    setMostrarForm(true);
  };

  const abrirFormEdicao = (categoria) => {
    setEditando(categoria);
    setNomeInput(categoria.nome);
    setMostrarForm(true);
  };

  const fecharForm = () => {
    setMostrarForm(false);
    setEditando(null);
    setNomeInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nomeInput.trim()) {
      showToast('O nome da categoria é obrigatório', 'error');
      return;
    }

    setSalvando(true);
    try {
      if (editando) {
        await api.put(`/categorias/${editando.id}`, { nome: nomeInput.trim() });
        showToast('Categoria atualizada com sucesso!', 'success');
      } else {
        await api.post('/categorias', { nome: nomeInput.trim() });
        showToast('Categoria criada com sucesso!', 'success');
      }
      fecharForm();
      await carregarCategorias();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      showToast(error.message || 'Erro ao salvar categoria', 'error');
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluir = async (categoria) => {
    if (!window.confirm(`Excluir a categoria "${categoria.nome}"? Campanhas vinculadas podem ser afetadas.`)) return;

    setExcluindoId(categoria.id);
    try {
      await api.delete(`/categorias/${categoria.id}`);
      showToast('Categoria excluída com sucesso', 'success');
      await carregarCategorias();
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      showToast('Não é possível excluir uma categoria que possui campanhas vinculadas.', 'error');
    } finally {
      setExcluindoId(null);
    }
  };

  return (
    <div className="categorias-container">
      <div className="categorias-header">
        <div>
          <h1>Gerenciar Categorias</h1>
          <p>
            {ehAdmin
              ? 'Categorias organizam as campanhas do sistema'
              : 'Categorias organizam as campanhas do sistema (somente leitura)'}
          </p>
        </div>
        {ehAdmin && (
          <button className="btn-nova-categoria" onClick={abrirFormCriacao}>
            + Nova Categoria
          </button>
        )}
      </div>

      {/* Formulário inline de criar/editar - só admin */}
      {ehAdmin && mostrarForm && (
        <div className="categoria-form-card">
          <h2>{editando ? 'Editar Categoria' : 'Nova Categoria'}</h2>
          <form onSubmit={handleSubmit} className="categoria-form">
            <div className="form-group">
              <label htmlFor="nome-categoria">Nome da Categoria *</label>
              <input
                id="nome-categoria"
                type="text"
                value={nomeInput}
                onChange={(e) => setNomeInput(e.target.value)}
                placeholder="Ex: Meio Ambiente, Educação..."
                maxLength={100}
                autoFocus
                required
              />
            </div>
            <div className="form-acoes">
              <button type="submit" className="btn-salvar" disabled={salvando}>
                {salvando ? 'Salvando...' : editando ? 'Salvar Alterações' : 'Criar Categoria'}
              </button>
              <button type="button" className="btn-cancelar" onClick={fecharForm} disabled={salvando}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div className="categorias-loading">Carregando categorias...</div>
      ) : erro ? (
        <div className="categorias-erro">{erro}</div>
      ) : categorias.length === 0 ? (
        <div className="categorias-vazio">
          <p>Nenhuma categoria cadastrada ainda.</p>
          {ehAdmin && (
            <button className="btn-nova-categoria" onClick={abrirFormCriacao}>
              Criar primeira categoria
            </button>
          )}
        </div>
      ) : (
        <div className="categorias-grid">
          {categorias.map((cat) => (
            <div key={cat.id} className="categoria-card">
              <div className="categoria-card-info">
                <span className="categoria-nome">{cat.nome}</span>
                <span className="categoria-projetos">
                  {cat.projetos?.length || 0} campanha(s)
                </span>
              </div>
              <div className="categoria-card-acoes">
                {ehAdmin && (
                  <>
                    <button
                      onClick={() => abrirFormEdicao(cat)}
                      className="btn-editar-cat"
                      title="Editar"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleExcluir(cat)}
                      disabled={excluindoId === cat.id}
                      className="btn-excluir-cat"
                      title="Excluir"
                    >
                      {excluindoId === cat.id ? (
                        '...'
                      ) : (
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" />
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        </svg>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categorias;