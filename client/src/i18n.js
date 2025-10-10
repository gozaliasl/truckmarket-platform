import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from './locales/en/translation.json';
import deTranslation from './locales/de/translation.json';
import esTranslation from './locales/es/translation.json';
import frTranslation from './locales/fr/translation.json';
import nlTranslation from './locales/nl/translation.json';
import plTranslation from './locales/pl/translation.json';
import roTranslation from './locales/ro/translation.json';
import ruTranslation from './locales/ru/translation.json';
import csTranslation from './locales/cs/translation.json';
import trTranslation from './locales/tr/translation.json';
import fiTranslation from './locales/fi/translation.json';

// Define resources
const resources = {
  en: { translation: enTranslation },
  de: { translation: deTranslation },
  es: { translation: esTranslation },
  fr: { translation: frTranslation },
  nl: { translation: nlTranslation },
  pl: { translation: plTranslation },
  ro: { translation: roTranslation },
  ru: { translation: ruTranslation },
  cs: { translation: csTranslation },
  tr: { translation: trTranslation },
  fi: { translation: fiTranslation }
};

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Default language
    debug: false, // Set to true for development debugging

    interpolation: {
      escapeValue: false // React already escapes values
    },

    detection: {
      // Order and from where user language should be detected
      order: ['localStorage', 'navigator', 'htmlTag'],

      // Keys or params to lookup language from
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    }
  });

export default i18n;
