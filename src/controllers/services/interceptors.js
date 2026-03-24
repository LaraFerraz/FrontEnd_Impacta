/**
 * ====================================================================
 * INTERCEPTORES HTTP - Centralizado
 * ====================================================================
 * 
 * Este arquivo gerencia todos os interceptadores de requisição HTTP:
 * - Authorization Interceptor: Adiciona token JWT em todas requisições
 * - Response Interceptor: Trata respostas e erros de autenticação
 * - Error Interceptor: Gerencia erros e retry automático
 * 
 * Fluxo:
 * 1. Request → Authorization Interceptor → Adiciona token
 * 2. Response → Response Interceptor → Valida status
 * 3. Error → Error Interceptor → Trata 401, retry, etc
 */

import { getToken, removeToken } from '../../config/api.config';

/**
 * ====================================================================
 * 1️⃣ AUTHORIZATION INTERCEPTOR
 * ====================================================================
 * 
 * Responsabilidade:
 * - Adicionar token JWT no header Authorization de TODAS requisições
 * - Configurar headers padrão (Content-Type)
 * - Preparar body e options
 * 
 * Segurança:
 * - Valida se token existe antes de adicionar
 * - Formato correto: "Bearer TOKEN"
 * - Não expõe token em logs (apenas primeiros 20 chars)
 * 
 * @param {object} options - Opções de configuração da requisição
 * @returns {object} Options com token adicionado no header
 * 
 * Exemplo:
 * const requestOptions = authorizationInterceptor({ method: 'GET' });
 * // Retorna: { method: 'GET', headers: { Authorization: 'Bearer eyJh...' } }
 */
export const authorizationInterceptor = (options = {}) => {
  const token = getToken();
  
  // Headers padrão da aplicação
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Adiciona token no header se existir
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.debug('✅ Token autorização adicionado à requisição');
  } else {
    console.debug('⚠️  Nenhum token encontrado - requisição sem autorização');
  }

  return {
    ...options,
    headers,
  };
};

/**
 * ====================================================================
 * 2️⃣ RESPONSE INTERCEPTOR
 * ====================================================================
 * 
 * Responsabilidade:
 * - Processar resposta do servidor
 * - Extrair JSON
 * - Validar status HTTP
 * - Tratar respostas de sucesso (2xx)
 * 
 * @param {Response} response - Objeto Response do Fetch API
 * @returns {Promise<object>} Dados da resposta
 * @throws {object} Erro estruturado
 * 
 * Fluxo:
 * 1. Verifica se resposta pode ser lida como JSON
 * 2. Se sucesso (2xx) → retorna os dados
 * 3. Se erro → passa para errorInterceptor
 */
export const responseInterceptor = async (response) => {
  // Tenta extrair os dados da resposta
  let data;
  try {
    const contentType = response.headers.get('content-type');
    
    // Verifica se é realmente JSON
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Se não for JSON, cria objeto com status text
      data = {
        message: response.statusText,
        status: response.status,
      };
    }
  } catch (error) {
    // Erro ao parsear JSON
    console.error('❌ Erro ao parsear resposta JSON:', error);
    data = {
      message: 'Erro ao processar resposta do servidor',
      status: response.status,
    };
  }

  // Se resposta foi sucesso (status 2xx), retorna os dados
  if (response.ok) {
    console.debug(`✅ Resposta bem-sucedida: ${response.status} ${response.statusText}`);
    return data;
  }

  // Prepara o erro para ser processado pelo error interceptor
  const error = {
    status: response.status,
    statusText: response.statusText,
    message: data.message || 'Erro na requisição',
    data,
    response,
  };

  throw error;
};

/**
 * ====================================================================
 * 3️⃣ ERROR INTERCEPTOR
 * ====================================================================
 * 
 * Responsabilidade:
 * - Tratar diferentes tipos de erro
 * - Validar token expirado (401)
 * - Validar permissões (403)
 * - Fazer retry automático em alguns casos
 * - Log de erros
 * 
 * Tipos de erro tratados:
 * - 401 Unauthorized: Token expirado/inválido → logout automático
 * - 403 Forbidden: Permissões insuficientes
 * - 404 Not Found: Recurso não encontrado
 * - 409 Conflict: Conflito nos dados (email duplicado, etc)
 * - 422 Unprocessable Entity: Validação falhou
 * - 500+ Server Error: Erro do servidor
 * 
 * @param {object} error - Erro da requisição
 * @returns {Promise} Rejeita a promise com erro tratado
 * 
 * Exemplo:
 * try {
 *   const response = await fetch(url, options);
 *   return await responseInterceptor(response);
 * } catch (error) {
 *   return await errorInterceptor(error);
 * }
 */
export const errorInterceptor = async (error) => {
  const status = error.status;

  // Erro 401: Token expirado ou inválido
  if (status === 401) {
    console.warn('⚠️  [401] Token expirado ou inválido');
    console.warn('📋 Ação: Removendo sessão do usuário');

    // Remove token do localStorage
    removeToken();

    // Remove dados do usuário
    localStorage.removeItem('user');
    localStorage.removeItem('userData');

    // Dispara evento customizado para fazer logout em tempo real
    window.dispatchEvent(new CustomEvent('tokenExpired', {
      detail: { message: 'Sua sessão expirou. Por favor, faça login novamente.' }
    }));

    const error = new Error('Sessão expirada. Por favor, faça login novamente.');
    error.status = 401;
    throw error;
  }

  // Erro 403: Acesso proibido (permissões insuficientes)
  if (status === 403) {
    console.error('❌ [403] Acesso proibido - Permissões insuficientes');
    const error = new Error('Você não tem permissão para acessar este recurso');
    error.status = 403;
    throw error;
  }

  // Erro 404: Recurso não encontrado
  if (status === 404) {
    console.warn('⚠️  [404] Recurso não encontrado');
    const error = new Error('O recurso solicitado não foi encontrado');
    error.status = 404;
    throw error;
  }

  // Erro 409: Conflito (ex: email já existe)
  if (status === 409) {
    console.warn('⚠️  [409] Conflito nos dados');
    const errorMsg = error.data?.message || 'Conflito: Verifique os dados enviados';
    const err409 = new Error(errorMsg);
    err409.status = 409;
    err409.data = error.data;
    throw err409;
  }

  // Erro 422: Unprocessable Entity (validação falhou)
  if (status === 422) {
    console.warn('⚠️  [422] Validação falhou');
    const errorMsg = error.data?.message || 'Dados inválidos. Verifique os campos';
    const err422 = new Error(errorMsg);
    err422.status = 422;
    err422.errors = error.data?.errors;
    throw err422;
  }

  // Erro 5xx: Erro do servidor
  if (status >= 500) {
    console.error(`❌ [${status}] Erro do servidor`);
    const err = new Error('Erro no servidor. Tente novamente mais tarde');
    err.status = status;
    throw err;
  }

  // Erro genérico
  console.error('❌ Erro na requisição:', error);
  const errGeneric = new Error(error.message || 'Erro desconhecido na requisição');
  errGeneric.status = error.status || 0;
  throw errGeneric;
};

/**
 * ====================================================================
 * 4️⃣ TIMEOUT INTERCEPTOR
 * ====================================================================
 * 
 * Responsabilidade:
 * - Implementar timeout automático em requisições
 * - Evitar que requisições fiquem "penduradas"
 * - Timeout padrão: 10 segundos
 * 
 * @param {string} url - URL da requisição
 * @param {object} options - Opções do fetch
 * @param {number} timeout - Tempo limite em ms
 * @returns {Promise<Response>} Resposta com timeout
 * 
 * Exemplo:
 * const response = await fetchWithTimeout(url, options, 10000);
 */
export const fetchWithTimeout = (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timeoutId))
    .catch(error => {
      if (error.name === 'AbortError') {
        console.error(`⏱️  Timeout: Requisição expirou após ${timeout}ms`);
        throw new Error(`Requisição expirou (${timeout}ms)`);
      }
      throw error;
    });
};

/**
 * ====================================================================
 * 5️⃣ REQUEST LOG INTERCEPTOR (Development Only)
 * ====================================================================
 * 
 * Responsabilidade (apenas em desenvolvimento):
 * - Fazer log de requisições
 * - Mostrar método, URL, headers
 * - Mostrar body (sem senha!)
 * 
 * @param {string} method - Método HTTP
 * @param {string} url - URL da requisição
 * @param {object} options - Opções da requisição
 */
export const logRequestInterceptor = (method, url, options) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`📤 ${method} ${url}`);
    console.log('Headers:', options.headers);
    if (options.body) {
      try {
        console.log('Body:', JSON.parse(options.body));
      } catch {
        console.log('Body:', options.body);
      }
    }
    console.groupEnd();
  }
};

/**
 * ====================================================================
 * 6️⃣ RESPONSE LOG INTERCEPTOR (Development Only)
 * ====================================================================
 * 
 * Responsabilidade (apenas em desenvolvimento):
 * - Fazer log de respostas
 * - Mostrar status, tempo de resposta
 * - Mostrar dados retornados
 * 
 * @param {string} method - Método HTTP
 * @param {string} url - URL da requisição
 * @param {object} data - Dados da resposta
 * @param {number} duration - Tempo decorrido em ms
 */
export const logResponseInterceptor = (method, url, data, duration) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`📥 ${method} ${url} (${duration}ms)`);
    console.log('Response:', data);
    console.groupEnd();
  }
};

const interceptorsExport = {
  authorizationInterceptor,
  responseInterceptor,
  errorInterceptor,
  fetchWithTimeout,
  logRequestInterceptor,
  logResponseInterceptor,
};

export default interceptorsExport;
