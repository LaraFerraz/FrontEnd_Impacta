import api from './api';

class UserService {
  async getAllUsers() {
    return api.get('/users');
  }

  async getUserById(id) {
    return api.get(`/users/${id}`);
  }

  async createUser(userData) {
    return api.post('/users', userData);
  }

  async updateUser(id, userData) {
    return api.put(`/users/${id}`, userData);
  }

  async deleteUser(id) {
    return api.delete(`/users/${id}`);
  }
}

export default new UserService();
