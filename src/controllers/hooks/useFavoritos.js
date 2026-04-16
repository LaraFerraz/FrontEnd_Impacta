import { useContext } from 'react';
import FavoritosContext from '../contexts/FavoritosContext';

export const useFavoritos = () => {
  const context = useContext(FavoritosContext);

  if (!context) {
    throw new Error('useFavoritos deve ser usado dentro de FavoritosProvider');
  }

  return context;
};

export default useFavoritos;
