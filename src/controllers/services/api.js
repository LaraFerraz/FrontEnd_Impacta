import axios from 'axios';
import { API_CONFIG, getToken, setToken, removeToken, TOKEN_KEY } from '../../config/api.config';

/**
 * ====================================================================
 * AXIOS COM INTERCEPTADORES E TOKEN JWT
 * ====================================================================
 * 
 * Este arquivo configura a instância do Axios com:
 * 1. Adição automática do token em todas as requisições
 * 2. Tratamento de erros de autenticação
 * 3. Métodos auxiliares para requisições HTTP
 */

/**
 * PASSO 1: Criar instância do Axios com configuração base
 * 
 * Isso evita usar axios diretamente e centraliza todas as variáveis:
 * - baseURL: Não precisa repetir URL em cada requisição
 * - timeout: Se demorar mais de 10s, cancela automaticamente
 * - headers: Content-Type padrão para JSON
 */
const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
});

/**
 * PASSO 2: INTERCEPTADOR DE REQUEST (Requisição)
 * ====================================================================
 * Executado ANTES de cada requisição ser enviada ao servidor
 * 
 * Função: Adicionar o token JWT no header Authorization
 * 
 * Fluxo:
 * 1. Recupera o token do localStorage
 * 2. Se token existe, adiciona no header como "Bearer TOKEN"
 * 3. Envia a requisição ao servidor
 * 
 * Headers enviados para o servidor:
 * {
 *   'Content-Type': 'application/json',
 *   'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...'
 * }
 */
apiClient.interceptors.request.use(
  (config) => {
    // Recupera o token do localStorage
    const token = getToken();
    
    // Se token existe, adiciona no header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Retorna a configuração modificada
    return config;
  },
  // Se houver erro ao preparar a requisição, rejeita
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * PASSO 3: INTERCEPTADOR DE RESPONSE (Resposta)
 * ====================================================================
 * Executado DEPOIS que o servidor responde
 * 
 * Casos de sucesso (2xx):
 * - Retorna apenas os dados (response.data)
 * 
 * Casos de erro:
 * - 401 (Não Autorizado): Token expirou ou inválido → faz logout
 * - 403 (Proibido): Usuário não tem permissão
 * - Outros: Retorna a mensagem de erro
 */
apiClient.interceptors.response.use(
  // Sucesso: Servidor respondeu com status 2xx
  (response) => {
    // Retorna apenas os dados do response (não metadata)
    // Exemplo: response.data = { user: {...}, message: "Sucesso" }
    return response.data;
  },
  
  // Erro: Servidor respondeu com status 4xx ou 5xx
  (error) => {
    // ERRO 401: Sessão expirada or token inválido
    if (error.response && error.response.status === 401) {
      console.warn('⚠️  Token expirado! Removendo sessão...');
      
      // Remove o token do localStorage
      removeToken();
      
      // Remove dados do usuário armazenados
      localStorage.removeItem('user');
      
      // Opcional: Redireciona para login
      // window.location.href = '/login';
    }

    // ERRO 403: Acesso proibido (permissões insuficientes)
    if (error.response && error.response.status === 403) {
      console.error('❌ Acesso proibido:', error.response.data);
    }

    // Retorna apenas os dados do erro (mais limpo que error completo)
    // error.response?.data: dados enviados pelo servidor
    // error: erro do Axios se não houver resposta
    return Promise.reject(error.response?.data || error);
  }
);

/**
 * CLASSE: ApiService
 * ====================================================================
 * Encapsula métodos HTTP com a instância configurada do Axios
 * 
 * Vantagens:
 * - Centraliza lógica HTTP
 * - Fácil manutenção
 * - Métodos reutilizáveis
 * - Token gerenciado automaticamente nos interceptadores
 */
class ApiService {
  /**
   * MÉTODO GET
   * Recupera dados do servidor (sem enviar dados no body)
   * 
   * @param {string} endpoint - Rota da API (ex: '/usuarios')
   * @param {object} config - Configuração adicional (ex: query params)
   * @returns {Promise} Resposta dos dados
   * 
   * Exemplo:
   * api.get('/usuarios')
   *   .then(data => console.log(data))
   *   .catch(error => console.error(error));
   * 
   * Request enviado:
   * GET http://localhost:3001/api/usuarios
   * Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
   */
  get(endpoint, config = {}) {
    return apiClient.get(endpoint, config);
  }

  /**
   * MÉTODO POST
   * Envia dados novos para o servidor (criar recurso)
   * 
   * @param {string} endpoint - Rota da API (ex: '/usuarios')
   * @param {object} data - Dados a enviar (ex: { nome, email })
   * @param {object} config - Configuração adicional
   * @returns {Promise} Resposta do servidor
   * 
   * Exemplo:
   * api.post('/usuarios', { nome: 'João', email: 'joao@email.com' })
   *   .then(data => console.log(data))
   *   .catch(error => console.error(error));
   * 
   * Request enviado:
   * POST http://localhost:3001/api/usuarios
   * Body: { nome: 'João', email: 'joao@email.com' }
   * Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
   */
  post(endpoint, data = {}, config = {}) {
    return apiClient.post(endpoint, data, config);
  }

  /**
   * MÉTODO PUT
   * Substitui um recurso completo no servidor (atualizar)
   * 
   * @param {string} endpoint - Rota da API (ex: '/usuarios/123')
   * @param {object} data - Dados completos do recurso
   * @param {object} config - Configuração adicional
   * @returns {Promise} Resposta do servidor
   * 
   * Exemplo:
   * api.put('/usuarios/123', { nome: 'Maria', email: 'maria@email.com' })
   */
  put(endpoint, data = {}, config = {}) {
    return apiClient.put(endpoint, data, config);
  }

  /**
   * MÉTODO PATCH
   * Atualiza parcialmente um recurso (muda alguns campos)
   * 
   * Diferença do PUT: PUT substitui tudo, PATCH muda só o que veio
   * 
   * @param {string} endpoint - Rota da API
   * @param {object} data - Apenas os campos a atualizar
   * @param {object} config - Configuração adicional
   * @returns {Promise} Resposta do servidor
   * 
   * Exemplo:
   * api.patch('/usuarios/123', { telefone: '111999999' })
   * // Só atualiza o telefone, outros dados não são alterados
   */
  patch(endpoint, data = {}, config = {}) {
    return apiClient.patch(endpoint, data, config);
  }

  /**
   * MÉTODO DELETE
   * Remove um recurso do servidor
   * 
   * @param {string} endpoint - Rota da API (ex: '/usuarios/123')
   * @param {object} config - Configuração adicional
   * @returns {Promise} Resposta do servidor
   * 
   * Exemplo:
   * api.delete('/usuarios/123')
   *   .then(() => console.log('Usuário deletado'))
   */
  delete(endpoint, config = {}) {
    return apiClient.delete(endpoint, config);
  }

  /**
   * MÉTODO REQUEST (Customizado)
   * Faz requisições com configuração personalizada
   * 
   * @param {object} config - Configuração completa (method, url, data, etc)
   * @returns {Promise} Resposta do servidor
   * 
   * Exemplo (requisição avançada com upload):
   * api.request({
   *   method: 'post',
   *   url: '/usuarios/foto',
   *   data: formData,
   *   headers: { 'Content-Type': 'multipart/form-data' }
   * })
   */
  request(config) {
    return apiClient.request(config);
  }

  /**
   * MÉTODO: Atualizar Token
   * Atualiza o token armazenado e nos headers do Axios
   * 
   * Chamado quando:
   * - Token é recebido após login/registro
   * - Token é renovado (refresh token)
   * 
   * @param {string} token - Novo token JWT
   * 
   * Exemplo:
   * api.setToken('eyJhbGciOiJIUzI1NiIs...');
   */
  setToken(token) {
    setToken(token);
    if (token) {
      // Adiciona token diretamente nos headers padrão do Axios
      apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }

  /**
   * MÉTODO: Remover Token
   * Remove o token armazenado e dos headers do Axios
   * 
   * Chamado quando:
   * - Usuário faz logout
   * - Sessão expira (erro 401)
   * 
   * Exemplo:
   * api.clearToken();
   */
  clearToken() {
    removeToken();
    delete apiClient.defaults.headers.common.Authorization;
  }

  /**
   * MÉTODO: Verificar se tem Token
   * Retorna true se token existe, false caso contrário
   * 
   * @returns {boolean}
   * 
   * Exemplo:
   * if (api.hasToken()) {
   *   console.log('Usuário autenticado!');
   * }
   */
  hasToken() {
    return !!getToken();
  }

  /**
   * MÉTODO: Obter Cliente Axios
   * Retorna a instância do Axios se precisar fazer algo customizado
   * 
   * @returns {AxiosInstance} Instância do axios.create()
   * 
   * Exemplo (avançado):
   * const client = api.getClient();
   * client.defaults.timeout = 20000; // Aumentar timeout
   */
  getClient() {
    return apiClient;
  }
}

/**
 * EXPORTAÇÃO
 * ====================================================================
 * Exporta uma ÚNICA instância de ApiService
 * Garante que há apenas uma configuração de Axios em toda a aplicação
 * 
 * Importar em qualquer arquivo assim:
 * import api from '@/controllers/services/api';
 * 
 * Usar:
 * api.get('/usuarios');
 * api.post('/login', { email, password });
 * api.delete('/usuarios/123');
 */
export default new ApiService();
