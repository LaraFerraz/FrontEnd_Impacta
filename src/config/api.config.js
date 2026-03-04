/**
 * Configuração da API
 */

export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export default API_CONFIG;
