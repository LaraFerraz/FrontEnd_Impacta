import React from 'react';
import './Toast.css';

const Toast = ({ toasts, onRemove }) => {
  if (!toasts || toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast toast--${toast.type}`}
          onClick={() => onRemove(toast.id)}
        >
          <div className="toast__icon">
            {getIcon(toast.type)}
          </div>
          <div className="toast__message">
            {toast.message}
          </div>
          <button 
            className="toast__close"
            onClick={() => onRemove(toast.id)}
            aria-label="Fechar notificação"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;