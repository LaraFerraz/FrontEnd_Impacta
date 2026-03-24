import { API_CONFIG } from '../../config/api.config';
import {
  authorizationInterceptor,
  responseInterceptor,
  errorInterceptor,
  fetchWithTimeout,
  logRequestInterceptor,
  logResponseInterceptor,
} from './interceptors';

/**
 * ====================================================================
 * API SERVICE - Com Interceptadores HTTP Profissionais
 * ====================================================================
 * 
 * Este arquivo centraliza todas as requisições HTTP com:
 * 1. ✅ Authorization Interceptor - Token JWT automático
 * 2. ✅ Response Interceptor - Valida e processa respostas
 * 3. ✅ Error Interceptor - Trata erros (401, 403, timeout, etc)
 * 4. ✅ Timeout Handler - Evita requisições penduradas
 * 5. ✅ Request/Response Logging - Debug em desenvolvimento
 * 
 * VANTAGENS:
 * - Sem dependências externas (nativo do JavaScript)
 * - Bundle size reduzido
 * - Melhor performance
 * - Interceptadores centralizados e reutilizáveis
 * - Fácil manutenção e extensão
 */


/**
 * ====================================================================
 * CLASSE: ApiService
 * ====================================================================
 * Encapsula todos os métodos HTTP com interceptadores profissionais
 * 
 * Fluxo de cada requisição:
 * 1. Authorization Interceptor → Adiciona token
 * 2. Request Logger → Log em desenvolvimento
 * 3. Fetch com Timeout → Requisição HTTP
 * 4. Response Interceptor → Valida resposta
 * 5. Error Interceptor → Trata erros
 * 6. Response Logger → Log da resposta
 * 
 * Exemplo:
 * const users = await api.get('/users');
 * const newUser = await api.post('/users', { name: 'João' });
 * await api.delete('/users/123');
 */
class ApiService {
  /**
   * MÉTODO: GET
   * Recupera dados do servidor
   * 
   * @param {string} endpoint - Rota da API (ex: '/users')
   * @param {object} config - Configuração adicional
   * @returns {Promise<object>} Dados retornados
   * 
   * Status de erro tratados:
   * - 401: Token expirado
   * - 403: Acesso proibido
   * - 404: Não encontrado
   * - 500: Erro do servidor
   * 
   * Exemplo:
   * try {
   *   const users = await api.get('/users');
   *   console.log(users);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  async get(endpoint, config = {}) {
    try {
      const url = `${API_CONFIG.baseURL}${endpoint}`;
      const startTime = performance.now();

      // 1️⃣ Authorization Interceptor → Adiciona token no header
      const options = authorizationInterceptor({
        method: 'GET',
        ...config,
      });

      // 2️⃣ Request Logger → Log em desenvolvimento
      logRequestInterceptor('GET', url, options);

      // 3️⃣ Fetch com Timeout
      const response = await fetchWithTimeout(url, options, API_CONFIG.timeout);

      // 4️⃣ Response Interceptor → Valida e extrai dados
      const data = await responseInterceptor(response);

      // 6️⃣ Response Logger
      const duration = performance.now() - startTime;
      logResponseInterceptor('GET', url, data, duration);

      return data;
    } catch (error) {
      // 5️⃣ Error Interceptor → Trata o erro
      return this._handleError(error);
    }
  }

  /**
   * MÉTODO: POST
   * Envia dados novos para o servidor (criar recurso)
   * 
   * @param {string} endpoint - Rota da API (ex: '/users')
   * @param {object} data - Dados a enviar
   * @param {object} config - Configuração adicional
   * @returns {Promise<object>} Resposta do servidor
   * 
   * Exemplo:
   * try {
   *   const newUser = await api.post('/users', {
   *     name: 'João',
   *     email: 'joao@email.com'
   *   });
   *   console.log('Usuário criado:', newUser.id);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  async post(endpoint, data = {}, config = {}) {
    try {
      const url = `${API_CONFIG.baseURL}${endpoint}`;
      const startTime = performance.now();

      const options = authorizationInterceptor({
        method: 'POST',
        body: JSON.stringify(data),
        ...config,
      });

      logRequestInterceptor('POST', url, options);

      const response = await fetchWithTimeout(url, options, API_CONFIG.timeout);
      const responseData = await responseInterceptor(response);

      const duration = performance.now() - startTime;
      logResponseInterceptor('POST', url, responseData, duration);

      return responseData;
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * MÉTODO: PUT
   * Substitui um recurso completo no servidor
   * 
   * Diferença do PATCH:
   * - PUT: Substitui TUDO (envie todos os campos)
   * - PATCH: Atualiza PARCIALMENTE (envie apenas mudanças)
   * 
   * @param {string} endpoint - Rota da API (ex: '/users/123')
   * @param {object} data - Dados completos do recurso
   * @param {object} config - Configuração adicional
   * @returns {Promise<object>} Recurso atualizado
   * 
   * Exemplo:
   * const updatedUser = await api.put('/users/123', {
   *   name: 'João Silva',
   *   email: 'joao@email.com',
   *   phone: '11999999999'
   * });
   */
  async put(endpoint, data = {}, config = {}) {
    try {
      const url = `${API_CONFIG.baseURL}${endpoint}`;
      const startTime = performance.now();

      const options = authorizationInterceptor({
        method: 'PUT',
        body: JSON.stringify(data),
        ...config,
      });

      logRequestInterceptor('PUT', url, options);

      const response = await fetchWithTimeout(url, options, API_CONFIG.timeout);
      const responseData = await responseInterceptor(response);

      const duration = performance.now() - startTime;
      logResponseInterceptor('PUT', url, responseData, duration);

      return responseData;
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * MÉTODO: PATCH
   * Atualiza parcialmente um recurso (apenas campos enviados)
   * 
   * @param {string} endpoint - Rota da API (ex: '/users/123')
   * @param {object} data - Apenas os campos a atualizar
   * @param {object} config - Configuração adicional
   * @returns {Promise<object>} Recurso atualizado
   * 
   * Exemplo:
   * const updated = await api.patch('/users/123', {
   *   phone: '11888888888' // Apenas telefone é atualizado
   * });
   */
  async patch(endpoint, data = {}, config = {}) {
    try {
      const url = `${API_CONFIG.baseURL}${endpoint}`;
      const startTime = performance.now();

      const options = authorizationInterceptor({
        method: 'PATCH',
        body: JSON.stringify(data),
        ...config,
      });

      logRequestInterceptor('PATCH', url, options);

      const response = await fetchWithTimeout(url, options, API_CONFIG.timeout);
      const responseData = await responseInterceptor(response);

      const duration = performance.now() - startTime;
      logResponseInterceptor('PATCH', url, responseData, duration);

      return responseData;
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * MÉTODO: DELETE
   * Remove um recurso do servidor
   * 
   * @param {string} endpoint - Rota da API (ex: '/users/123')
   * @param {object} config - Configuração adicional
   * @returns {Promise<object>} Confirmação da exclusão
   * 
   * Exemplo:
   * try {
   *   const result = await api.delete('/users/123');
   *   console.log('Usuário deletado com sucesso');
   * } catch (error) {
   *   console.error('Erro ao deletar:', error.message);
   * }
   */
  async delete(endpoint, config = {}) {
    try {
      const url = `${API_CONFIG.baseURL}${endpoint}`;
      const startTime = performance.now();

      const options = authorizationInterceptor({
        method: 'DELETE',
        ...config,
      });

      logRequestInterceptor('DELETE', url, options);

      const response = await fetchWithTimeout(url, options, API_CONFIG.timeout);
      const responseData = await responseInterceptor(response);

      const duration = performance.now() - startTime;
      logResponseInterceptor('DELETE', url, responseData, duration);

      return responseData;
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * MÉTODO: REQUEST (Customizado)
   * Faz requisições com configuração totalmente personalizada
   * 
   * Útil para casos especiais (upload, requisições complexas)
   * 
   * @param {object} config - Configuração completa
   * @returns {Promise<object>} Resposta do servidor
   * 
   * Exemplo (upload com FormData):
   * const formData = new FormData();
   * formData.append('file', file);
   * formData.append('name', 'Meu arquivo');
   * 
   * const result = await api.request({
   *   method: 'POST',
   *   endpoint: '/uploads',
   *   body: formData,
   *   headers: { 'Content-Type': 'multipart/form-data' }
   * });
   */
  async request(config = {}) {
    try {
      const { endpoint = '', ...restConfig } = config;
      const url = `${API_CONFIG.baseURL}${endpoint}`;
      const startTime = performance.now();

      // Para upload com FormData, não converter body para string
      const bodyToSend = 
        restConfig.body instanceof FormData 
          ? restConfig.body 
          : restConfig.body ? JSON.stringify(restConfig.body) : undefined;

      const options = authorizationInterceptor({
        ...restConfig,
        body: bodyToSend,
      });

      const method = restConfig.method || 'GET';
      logRequestInterceptor(method, url, options);

      const response = await fetchWithTimeout(url, options, API_CONFIG.timeout);
      const responseData = await responseInterceptor(response);

      const duration = performance.now() - startTime;
      logResponseInterceptor(method, url, responseData, duration);

      return responseData;
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * MÉTODO PRIVADO: _handleError
   * Processa erros usando o Error Interceptor
   * 
   * Tratamentos:
   * - 401: Token expirado → Logout automático
   * - 403: Acesso proibido
   * - 404: Recurso não encontrado
   * - 409: Conflito (ex: email já existe)
   * - 422: Validação falhou
   * - 500+: Erro do servidor
   * 
   * @param {object} error - Erro capturado
   * @throws {object} Erro tratado e estruturado
   */
  async _handleError(error) {
    const handledError = await errorInterceptor(error);
    throw handledError;
  }

  /**
   * MÉTODO: Atualizar Token
   * Armazena o token JWT recebido do servidor
   * 
   * Chamado em:
   * - Login bem-sucedido
   * - Refresh token
   * 
   * @param {string} token - Token JWT do servidor
   * 
   * Exemplo:
   * api.setToken(response.token);
   */
  setToken(token) {
    if (token) {
      const { setToken } = require('../../config/api.config');
      setToken(token);
      console.log('✅ Token atualizado');
    }
  }

  /**
   * MÉTODO: Remover Token
   * Remove o token do localStorage
   * 
   * Chamado em:
   * - Logout do usuário
   * - Sessão expirada (erro 401)
   * 
   * Exemplo:
   * api.clearToken();
   */
  clearToken() {
    const { removeToken } = require('../../config/api.config');
    removeToken();
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
    console.log('✅ Token removido');
  }

  /**
   * MÉTODO: Verificar Token
   * Verifica se há um token válido armazenado
   * 
   * @returns {boolean} true se tem token, false caso contrário
   * 
   * Exemplo:
   * if (api.hasToken()) {
   *   console.log('Usuário autenticado!');
   * } else {
   *   window.location.href = '/login';
   * }
   */
  hasToken() {
    const { getToken } = require('../../config/api.config');
    return !!getToken();
  }
}

/**
 * EXPORTAÇÃO
 * ====================================================================
 * Exporta uma instância única (Singleton) para usar em toda a app
 * 
 * Uso:
 * import api from './api';
 * api.get('/users').then(users => console.log(users));
 */
const apiService = new ApiService();

export default apiService;
