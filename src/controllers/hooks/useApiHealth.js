/**
 * Hook: useApiHealth
 * 
 * Verifica se a API backend está disponível e funcionando
 * Útil para detectar quando o backend ainda não iniciou
 * 
 * Uso:
 * const { isHealthy, isChecking, error } = useApiHealth();
 * 
 * if (isChecking) return <div>Conectando ao servidor...</div>;
 * if (!isHealthy) return <div>Servidor indisponível: {error}</div>;
 * // Renderizar app normalmente
 */

import { useState, useEffect } from 'react';
import { API_CONFIG } from '../../config/api.config';

export const useApiHealth = () => {
  const [isHealthy, setIsHealthy] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await fetch(`${API_CONFIG.baseURL}/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ API está saudável:', data);
          setIsHealthy(true);
          setError(null);
          setIsChecking(false);
          return;
        } else {
          throw new Error(`Status ${response.status}`);
        }
      } catch (err) {
        console.warn(`⚠️ API ainda não está disponível (tentativa ${attempts + 1}):`, err.message);
        
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 30) {
          // Após 30 tentativas (30 segundos), só avisa mas não bloqueia
          console.error('❌ API não respondeu após 30 tentativas');
          setError(`API indisponível - ${err.message}`);
          setIsHealthy(false);
          setIsChecking(false);
        } else {
          // Tenta novamente após 1 segundo
          setTimeout(() => {
            setIsChecking(true);
            checkApiHealth();
          }, 1000);
        }
      }
    };

    if (isChecking) {
      checkApiHealth();
    }
  }, [isChecking, attempts]);

  return { isHealthy, isChecking, error, attempts };
};

export default useApiHealth;
