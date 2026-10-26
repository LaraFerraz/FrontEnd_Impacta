export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'https://localhost/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const TOKEN_KEY = 'token';
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export default API_CONFIG;