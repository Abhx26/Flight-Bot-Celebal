import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      search_flights: 'Search Flights',
      login: 'Login',
      register: 'Register',
      // ... more keys
    },
  },
  es: {
    translation: {
      welcome: 'Bienvenido',
      search_flights: 'Buscar vuelos',
      login: 'Iniciar sesión',
      register: 'Registrarse',
      // ... more keys
    },
  },
  fr: {
    translation: {
      welcome: 'Bienvenue',
      search_flights: 'Rechercher des vols',
      login: 'Connexion',
      register: 'S’inscrire',
      // ... more keys
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n; 