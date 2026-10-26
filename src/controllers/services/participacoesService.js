import api from './api';

/**
 * ====================================================================
 * PARTICIPAÇÕES SERVICE
 * ====================================================================
 * Serviço centralizado para gerenciar inscrições em campanhas
 * 
 * Operações:
 * - Se inscrever em uma campanha
 * - Listar campanhas que um usuário se inscreveu
 * - Verificar se usuário já se inscreveu em uma campanha
 * - Cancelar inscrição em uma campanha
 */

const participacoesService = {
  /**
   * Se inscrever em uma campanha
   * @param {number} usuario_id - ID do usuário
   * @param {number} projeto_id - ID da campanha
   * @param {number} servico_id - ID do serviço (opcional)
   * @returns {Promise<object>} Dados da inscrição criada
   */
  async inscreverEmCampanha(usuario_id, projeto_id, servico_id = null) {
    try {
      const payload = {
        usuario_id,
        projeto_id
      };

      if (servico_id) {
        payload.servico_id = servico_id;
      }

      const response = await api.post('/participacoes', payload);

      return {
        sucesso: true,
        mensagem: response.message || 'Inscrição realizada com sucesso!',
        dados: response.data
      };
    } catch (error) {
      console.error('Erro ao se inscrever em campanha:', error);
      
      // Tratamento de erros específicos
      if (error.status === 409) {
        return {
          sucesso: false,
          mensagem: 'Você já está inscrito nesta campanha',
          erro: error.message
        };
      }

      return {
        sucesso: false,
        mensagem: error.message || 'Erro ao se inscrever na campanha',
        erro: error.message
      };
    }
  },

  /**
   * Listar campanhas que um usuário se inscreveu
   * @param {number} usuario_id - ID do usuário
   * @param {number} page - Página (padrão: 1)
   * @param {number} limit - Limite por página (padrão: 10)
   * @returns {Promise<object>} Lista de campanhas com paginação
   */
  async obterCampanhasDoUsuario(usuario_id, page = 1, limit = 10) {
    try {
      const response = await api.get(
        `/participacoes/usuario/${usuario_id}/campanhas?page=${page}&limit=${limit}`
      );

      return {
        sucesso: true,
        dados: response.data,
        paginacao: response.pagination
      };
    } catch (error) {
      console.error('Erro ao obter campanhas do usuário:', error);
      return {
        sucesso: false,
        mensagem: error.message || 'Erro ao carregar campanhas',
        erro: error.message
      };
    }
  },

  /**
   * Verificar se usuário já se inscreveu em uma campanha
   * @param {number} usuario_id - ID do usuário
   * @param {number} projeto_id - ID da campanha
   * @returns {Promise<object>} Dados de verificação e participação (se existir)
   */
  async verificarInscricao(usuario_id, projeto_id) {
    try {
      const response = await api.get(
        `/participacoes/usuario/${usuario_id}/projeto/${projeto_id}/existe`
      );

      return {
        sucesso: true,
        inscrito: response.existe,
        dados: response.data
      };
    } catch (error) {
      console.error('Erro ao verificar inscrição:', error);
      return {
        sucesso: false,
        mensagem: error.message || 'Erro ao verificar inscrição',
        erro: error.message
      };
    }
  },

  /**
   * Listar participações com filtros
   * @param {object} filtros - Filtros (usuario_id, projeto_id, status_participacao_id)
   * @param {number} page - Página (padrão: 1)
   * @param {number} limit - Limite por página (padrão: 10)
   * @returns {Promise<object>} Lista de participações
   */
  async listarParticipacoes(filtros = {}, page = 1, limit = 10) {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filtros
      });

      const response = await api.get(`/participacoes?${params}`);

      return {
        sucesso: true,
        dados: response.data,
        paginacao: response.pagination
      };
    } catch (error) {
      console.error('Erro ao listar participações:', error);
      return {
        sucesso: false,
        mensagem: error.message || 'Erro ao listar participações',
        erro: error.message
      };
    }
  },

  /**
   * Cancelar inscrição em uma campanha
   * @param {number} participacao_id - ID da participação
   * @returns {Promise<object>} Resultado da operação
   */
  async cancelarInscricao(participacao_id) {
    try {
      const response = await api.delete(`/participacoes/${participacao_id}`);

      return {
        sucesso: true,
        mensagem: response.message || 'Inscrição cancelada com sucesso',
        dados: response.data
      };
    } catch (error) {
      console.error('Erro ao cancelar inscrição:', error);
      return {
        sucesso: false,
        mensagem: error.message || 'Erro ao cancelar inscrição',
        erro: error.message
      };
    }
  }
};

export default participacoesService;
