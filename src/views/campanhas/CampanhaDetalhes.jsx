import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../controllers/services/api';
import participacoesService from '../../controllers/services/participacoesService';
import { useToast } from '../../controllers/hooks/useToast';
import useFavoritos from '../../controllers/hooks/useFavoritos';
import RatingComponent from './RatingComponent';
import './CampanhaDetalhes.css';

const CampanhaDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { favoritos, addFavorito, removeFavorito, loadUserFavoritos } = useFavoritos();
  const [campanha, setCampanha] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [usuarioInscrito, setUsuarioInscrito] = useState(false);
  const [loadingInscricao, setLoadingInscricao] = useState(false);
  const [inscricaoData, setInscricaoData] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loadingFavorito, setLoadingFavorito] = useState(false);

  useEffect(() => {
    carregarDetalhes();
    
    // Carregar dados do usuário
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUsuario(user);
        // Verificar se usuário está inscrito nesta campanha
        verificarInscricao(user.id);
        // Carregar favoritos do usuário
        loadUserFavoritos(user.id);
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Verificar se esta campanha é um favorito
  useEffect(() => {
    if (favoritos.length > 0) {
      const favoritado = favoritos.some(fav => fav.projeto_id === parseInt(id));
      setIsFavorited(favoritado);
    }
  }, [favoritos, id]);

  const verificarInscricao = async (usuario_id) => {
    try {
      const resultado = await participacoesService.verificarInscricao(usuario_id, id);
      if (resultado.sucesso) {
        setUsuarioInscrito(resultado.inscrito);
        if (resultado.inscrito) {
          setInscricaoData(resultado.dados);
        }
      }
    } catch (err) {
      console.error('Erro ao verificar inscrição:', err);
    }
  };

  const carregarDetalhes = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/projetos/${id}`);
      
      if (response && response.data) {
        setCampanha(response.data);
      }
    } catch (err) {
      console.error('Erro ao carregar campanha:', err);
      setError('Erro ao carregar detalhes da campanha');
    } finally {
      setLoading(false);
    }
  };

  const handleInscrever = async () => {
    if (!usuario) {
      showToast('Você precisa estar logado para se inscrever', 'warning');
      navigate('/login');
      return;
    }

    setLoadingInscricao(true);
    try {
      const resultado = await participacoesService.inscreverEmCampanha(usuario.id, parseInt(id));
      
      if (resultado.sucesso) {
        showToast(resultado.mensagem || 'Inscrição realizada com sucesso!', 'success');
        setUsuarioInscrito(true);
        setInscricaoData(resultado.dados);
        // Recarregar para atualizar número de participantes
        await carregarDetalhes();
      } else {
        showToast(resultado.mensagem || 'Erro ao se inscrever', 'error');
      }
    } catch (error) {
      console.error('Erro ao se inscrever:', error);
      showToast('Erro ao se inscrever na campanha', 'error');
    } finally {
      setLoadingInscricao(false);
    }
  };

  const handleCancelarInscricao = async () => {
    if (!inscricaoData?.id) return;

    if (window.confirm('Tem certeza que deseja cancelar sua inscrição?')) {
      setLoadingInscricao(true);
      try {
        const resultado = await participacoesService.cancelarInscricao(inscricaoData.id);
        
        if (resultado.sucesso) {
          showToast(resultado.mensagem || 'Inscrição cancelada', 'success');
          setUsuarioInscrito(false);
          setInscricaoData(null);
          // Recarregar para atualizar número de participantes
          await carregarDetalhes();
        } else {
          showToast(resultado.mensagem || 'Erro ao cancelar inscrição', 'error');
        }
      } catch (error) {
        console.error('Erro ao cancelar inscrição:', error);
        showToast('Erro ao cancelar inscrição', 'error');
      } finally {
        setLoadingInscricao(false);
      }
    }
  };

  const handleToggleFavorito = async () => {
    if (!usuario) {
      showToast('Você precisa estar logado para favoritar', 'warning');
      navigate('/login');
      return;
    }

    setLoadingFavorito(true);
    try {
      if (isFavorited) {
        // Remover favorito
        const favoritoParaRemover = favoritos.find(fav => fav.projeto_id === parseInt(id));
        if (favoritoParaRemover) {
          await removeFavorito(usuario.id, favoritoParaRemover.id);
          setIsFavorited(false);
          showToast('Removido dos favoritos', 'success');
        }
      } else {
        // Adicionar favorito
        await addFavorito(usuario.id, parseInt(id));
        setIsFavorited(true);
        showToast('Adicionado aos favoritos! ❤️', 'success');
      }
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
      showToast('Erro ao atualizar favorito', 'error');
    } finally {
      setLoadingFavorito(false);
    }
  };

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

  if (loading) return <div className="loading-full">Carregando...</div>;
  if (error) return <div className="error-full">{error}</div>;
  if (!campanha) return <div className="error-full">Campanha não encontrada</div>;

  const infos = campanha.informacoes;
  const mediaAvaliacoes = campanha.avaliacoes?.length > 0
    ? (campanha.avaliacoes.reduce((acc, av) => acc + av.nota, 0) / campanha.avaliacoes.length).toFixed(1)
    : 0;

  return (
    <div className="campanha-detalhes-container">
      {/* Header */}
      <div className="detalhes-header">
        <button onClick={() => navigate('/campanhas')} className="btn-voltar">
          ← Voltar
        </button>
        <div className="titulo-section">
          <h1>{campanha.titulo}</h1>
          <span className="status-badge" style={{ backgroundColor: getStatusColor(campanha.status.nome) }}>
            {campanha.status.nome}
          </span>
        </div>
        <button 
          onClick={handleToggleFavorito}
          disabled={loadingFavorito}
          className={`btn-favorito ${isFavorited ? 'favoritado' : ''}`}
          title={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <svg viewBox="0 0 24 24" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          {loadingFavorito ? '...' : isFavorited ? 'Favoritado' : 'Favoritar'}
        </button>
      </div>

      {/* Seção de Inscrição */}
      {usuario?.id !== campanha.criador.id && (
        <div className="inscricao-section">
          {usuarioInscrito ? (
            <div className="inscricao-card inscrito">
              <div className="inscricao-info">
                <h3>✓ Você está inscrito nesta campanha</h3>
                <p>Status: <strong>{inscricaoData?.status?.nome || 'Pendente'}</strong></p>
                <p>Data de inscrição: <strong>{formatarData(inscricaoData?.data_inscricao)}</strong></p>
              </div>
              <button
                onClick={handleCancelarInscricao}
                disabled={loadingInscricao}
                className="btn-cancelar"
              >
                {loadingInscricao ? 'Cancelando...' : 'Cancelar Inscrição'}
              </button>
            </div>
          ) : (
            <div className="inscricao-card nao-inscrito">
              <div className="inscricao-info">
                <h3>Participar desta Campanha</h3>
                <p>{usuario ? 'Se inscreva agora para colaborar neste projeto!' : 'Faça login para se inscrever nesta campanha!'}</p>
              </div>
              <button
                onClick={handleInscrever}
                disabled={loadingInscricao}
                className="btn-inscrever"
              >
                {loadingInscricao ? 'Inscrevendo...' : '+ Se Inscrever'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Informações Principais */}
      <div className="info-principais">
        <div className="info-card">
          <h3>Informações da Campanha</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Criador:</span>
              <span className="value">{campanha.criador.nome}</span>
            </div>
            <div className="info-item">
              <span className="label">Cidade:</span>
              <span className="value">{campanha.cidade.nome}</span>
            </div>
            <div className="info-item">
              <span className="label">Categoria:</span>
              <span className="value">{campanha.categoria.nome}</span>
            </div>
            <div className="info-item">
              <span className="label">Data de Criação:</span>
              <span className="value">{formatarData(campanha.data_criacao)}</span>
            </div>
            <div className="info-item">
              <span className="label">Início:</span>
              <span className="value">{formatarData(campanha.data_inicio)}</span>
            </div>
            <div className="info-item">
              <span className="label">Término:</span>
              <span className="value">{formatarData(campanha.data_fim)}</span>
            </div>
            {campanha.meta_participantes && (
              <div className="info-item">
                <span className="label">Meta de Participantes:</span>
                <span className="value">{campanha.meta_participantes}</span>
              </div>
            )}
            <div className="info-item">
              <span className="label">Total de Participantes:</span>
              <span className="value">{campanha.participacoes?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Avaliações */}
        <div className="info-card avaliacoes-card">
          <h3>Avaliações</h3>
          <div className="avaliacoes-stats">
            <div className="media-avaliacoes">
              <div className="nota-grande">{mediaAvaliacoes}</div>
              <small>({campanha.avaliacoes?.length || 0} {campanha.avaliacoes?.length === 1 ? 'avaliação' : 'avaliações'})</small>
            </div>
            <div className="stars">
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} className={`star ${star <= Math.round(mediaAvaliacoes) ? 'filled' : ''}`}>
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Descrição */}
      <div className="descricao-section">
        <h3>Descrição da Campanha</h3>
        <p>{campanha.descricao}</p>
      </div>

      {/* Informações Detalhadas */}
      {infos && (
        <div className="informacoes-detalhadas">
          <h3>Informações Detalhadas</h3>
          <div className="detalhes-grid">
            {infos.objetivos && (
              <div className="detalhe-item">
                <h4>Objetivos</h4>
                <p>{infos.objetivos}</p>
              </div>
            )}
            {infos.publico_alvo && (
              <div className="detalhe-item">
                <h4>Público Alvo</h4>
                <p>{infos.publico_alvo}</p>
              </div>
            )}
            {infos.impacto_esperado && (
              <div className="detalhe-item">
                <h4>Impacto Esperado</h4>
                <p>{infos.impacto_esperado}</p>
              </div>
            )}
            {infos.regras && (
              <div className="detalhe-item">
                <h4>Regras</h4>
                <p>{infos.regras}</p>
              </div>
            )}
            {infos.observacoes && (
              <div className="detalhe-item">
                <h4>Observações</h4>
                <p>{infos.observacoes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Componente de Avaliações */}
      {usuario && (
        <RatingComponent projetoId={id} onRatingSuccess={() => carregarDetalhes()} />
      )}

      {/* Serviços Disponíveis */}
      {campanha.servicos && campanha.servicos.length > 0 && (
        <div className="servicos-section">
          <h3>Serviços Disponíveis</h3>
          <div className="servicos-grid">
            {campanha.servicos.map(servico => (
              <div key={servico.id} className="servico-card">
                <h4>{servico.nome_servico}</h4>
                <p className="descricao">{servico.descricao}</p>
                <div className="servico-info">
                  <span>Necessário(s): {servico.quantidade_necessaria}</span>
                  <span className="status">{servico.status.nome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampanhaDetalhes;
