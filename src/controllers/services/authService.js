import api from './api';
import { setToken as setTokenStorage, removeToken as removeTokenStorage, getToken as getTokenStorage } from '../../config/api.config';

/**
 * ====================================================================
 * AUTH SERVICE - Gerencia Autenticação e Token JWT
 * ====================================================================
 * 
 * Este serviço centraliza todas operações de autenticação:
 * - Login: Enviar credenciais e receber token
 * - Registro: Criar novo usuário com token
 * - Logout: Limpar token e dados
 * - Getters: Recuperar informações do usuário/token
 * 
 * Todas as requisições são feitas através de 'api' que trata o token
 */

class AuthService {
  /**
   * MÉTODO: LOGIN
   * ====================================================================
   * Envia email/senha para servidor e recebe token JWT
   * 
   * Fluxo:
   * 1. Envia POST /auth/login com email e password
   * 2. Servidor valida e retorna { token, user }
   * 3. Armazena token no localStorage
   * 4. Configura token no header do Axios
   * 5. Retorna resposta (contem dados do usuário)
   * 
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise<object>} { token, user, message }
   * 
   * Exemplo de uso:
   * try {
   *   const response = await authService.login('joao@email.com', '123456');
   *   console.log('Logado como:', response.user.nome);
   *   // Token enviado automaticamente nas próximas requisições!
   * } catch (error) {
   *   console.error('Login falhou:', error.message);
   * }
   */
  async login(email, password) {
    try {
      // 1. ENVIAR CREDENCIAIS
      // POST http://localhost:3001/api/auth/login
      // { email: "joao@email.com", password: "123456" }
      const response = await api.post('/auth/login', { email, password });
      
      // 2. RECEBER E ARMAZENAR TOKEN
      // Resposta esperada: { token: "eyJhbGc...", user: { id, nome, email } }
      if (response.token) {
        // Salva token no localStorage (sobrevive ao refresh da página)
        setTokenStorage(response.token);
        
        // Configura token no header do Axios para próximas requisições
        // Todas os GET, POST, PUT, DELETE agora enviam:
        // Authorization: Bearer eyJhbGc...
        api.setToken(response.token);
        
        // 3. ARMAZENAR DADOS DO USUÁRIO
        // Salva informações do usuário para usar na interface
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * MÉTODO: REGISTRO
   * ====================================================================
   * Cria novo usuário e recebe token automaticamente
   * 
   * Fluxo similar ao login, mas enviando mais dados
   * 
   * @param {object} userData - Dados do novo usuário
   *   {
   *     nome: string,
   *     email: string,
   *     password: string,
   *     telefone: string,
   *     cidade: string,
   *     interesses?: array
   *   }
   * @returns {Promise<object>} { token, user, message }
   * 
   * Exemplo de uso:
   * try {
   *   const response = await authService.register({
   *     nome: 'Maria',
   *     email: 'maria@email.com',
   *     password: '123456',
   *     telefone: '11999999999',
   *     cidade: 'São Paulo',
   *     interesses: ['programação', 'tecnologia']
   *   });
   *   console.log('Cadastro bem-sucedido! Token armazenado.');
   *   // Usuário já está logado após registro
   * } catch (error) {
   *   console.error('Registro falhou:', error.message);
   * }
   */
  async register(userData) {
    try {
      // 1. FORMATAR DADOS PARA O BACKEND
      // Garante que os dados estão no formato esperado pelo servidor
      const registerData = {
        nome: userData.nome,
        email: userData.email,
        password: userData.password,
        telefone: userData.telefone,
        cidade: userData.cidade,
        interesses: userData.interesses || []
      };

      // 2. ENVIAR DADOS
      // POST http://localhost:3001/api/auth/register
      const response = await api.post('/auth/register', registerData);
      
      // 3. ARMAZENAR TOKEN (mesmo processo do login)
      if (response.token) {
        setTokenStorage(response.token);
        api.setToken(response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * MÉTODO: VERIFICAR TOKEN
   * ====================================================================
   * Valida se o token ainda é válido no servidor
   * Usado para revalidar sessão após recarregar página
   * 
   * Fluxo:
   * 1. Recupera token do localStorage
   * 2. Envia POST /auth/verify com o token
   * 3. Se válido, retorna dados do usuário
   * 4. Se inválido (expired), faz logout automático
   * 
   * @returns {Promise<object|null>} Dados do usuário ou null se inválido
   * 
   * Exemplo de uso:
   * // Em um useEffect quando app inicia
   * useEffect(() => {
   *   authService.verifyToken()
   *     .then(user => {
   *       if (user) {
   *         console.log('Sessão válida! Usuário:', user.nome);
   *       } else {
   *         console.log('Sessão expirada, redirecionando para login');
   *       }
   *     });
   * }, []);
   */
  async verifyToken() {
    try {
      // Recupera token armazenado
      const token = this.getToken();
      
      // Se não há token, retorna null (não autenticado)
      if (!token) {
        return null;
      }

      // Envia POST com token no header (adicionado automaticamente pelo interceptador)
      // O servidor verifica se o token é válido
      const response = await api.post('/auth/verify');
      
      // Retorna dados do usuário se token é válido
      return response.user || null;
    } catch (error) {
      // Se erro ao verificar (token expirado, inválido), faz logout
      this.logout();
      return null;
    }
  }

  /**
   * MÉTODO: LOGOUT
   * ====================================================================
   * Remove todas as informações de autenticação do navegador
   * 
   * Ações:
   * 1. Remove token do localStorage
   * 2. Remove Authorization header do Axios
   * 3. Remove dados do usuário
   * 
   * Exemplo de uso:
   * async function handleLogout() {
   *   authService.logout();
   *   console.log('Deslogado com sucesso!');
   *   navigate('/login'); // Redireciona para login
   * }
   * 
   * O que acontece após logout:
   * - Requisições HTTP NÃO enviam Authorization header
   * - Servidor retorna 401 se tentar acessar sem token
   */
  logout() {
    // Remove token do localStorage
    removeTokenStorage();
    
    // Remove Authorization header do Axios
    // Próximas requisições não terão token
    api.clearToken();
    
    // Remove dados do usuário armazenados
    localStorage.removeItem('user');
  }

  /**
   * MÉTODO: Obter Usuário Atual
   * ====================================================================
   * Recupera dados do usuário armazenados no localStorage
   * Útil para preencher interface com dados do usuário logado
   * 
   * @returns {object|null} Dados do usuário ou null se não logado
   * 
   * Exemplo de uso:
   * const user = authService.getCurrentUser();
   * if (user) {
   *   console.log('Bem-vindo,', user.nome);
   *   console.log('Email:', user.email);
   * } else {
   *   console.log('Nenhum usuário logado');
   * }
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * MÉTODO: Verificar Autenticação
   * ====================================================================
   * Retorna true/false se há token válido armazenado
   * 
   * Útil para:
   * - Mostrar/ocultar menu de logout
   * - Proteger rotas privadas
   * - Condicional rendering
   * 
   * @returns {boolean} true se autenticado, false caso contrário
   * 
   * Exemplo de uso:
   * if (authService.isAuthenticated()) {
   *   return <Dashboard />; // Mostrar painel
   * } else {
   *   return <Login />; // Mostrar login
   * }
   */
  isAuthenticated() {
    return !!getTokenStorage();
  }

  /**
   * MÉTODO: Obter Token
   * ====================================================================
   * Recupera o token JWT armazenado
   * 
   * Raramente usado, pois Axios gerencia automaticamente
   * Útil para debug ou enviar token manualmente
   * 
   * @returns {string|null} Token JWT ou null
   * 
   * Exemplo de uso:
   * const token = authService.getToken();
   * console.log('Token armazenado:', token);
   */
  getToken() {
    return getTokenStorage();
  }
}

/**
 * EXPORTAÇÃO
 * ====================================================================
 * Exporta uma ÚNICA instância do serviço
 * 
 * Importar em qualquer arquivo assim:
 * import authService from '@/controllers/services/authService';
 * 
 * Usar:
 * authService.login(email, password);
 * authService.logout();
 * authService.isAuthenticated();
 * authService.getCurrentUser();
 */
const authService = new AuthService();

export default authService;
