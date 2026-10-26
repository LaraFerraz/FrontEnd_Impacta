import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que faz scroll para o topo da página quando a rota muda
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
