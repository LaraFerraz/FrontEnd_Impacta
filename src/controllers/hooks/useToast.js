import { useState } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    const newToast = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message) => showToast(message, 'success');
  const showError = (message) => showToast(message, 'error');
  const showInfo = (message) => showToast(message, 'info');
  const showWarning = (message) => showToast(message, 'warning');

  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    removeToast
  };
};