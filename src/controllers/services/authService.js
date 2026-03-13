import api from './api';

class AuthService {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async register(userData) {
    try {
      // Transformar dados para o formato esperado pelo backend
      const registerData = {
        nome: userData.nome,
        email: userData.email,
        password: userData.password,
        telefone: userData.telefone,
        cidade: userData.cidade,
        interesses: userData.interesses || []
      };

      const response = await api.post('/auth/register', registerData);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async verifyToken() {
    try {
      const token = this.getToken();
      if (!token) {
        return null;
      }

      const response = await api.post('/auth/verify');
      return response.data;
    } catch (error) {
      this.logout();
      return null;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();
