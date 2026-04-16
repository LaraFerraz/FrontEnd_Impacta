import { useContext } from 'react';
import PreferencesContext from '../contexts/PreferencesContext';

export const usePreferences = () => {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error('usePreferences deve ser usado dentro de PreferencesProvider');
  }

  return context;
};

export default usePreferences;
