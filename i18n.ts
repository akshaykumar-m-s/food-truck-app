import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import your translation JSON files
import en from './src/i18n/locales/en.json';
import pl from './src/i18n/locales/pl.json';

i18n
  .use(initReactI18next)
  .init({
    react: {
      useSuspense: false, // This prevents the "Blank Screen" during load
    },
    resources: {
      en: { translation: en },
      pl: { translation: pl },
    },
    lng: Localization.getLocales()[0].languageCode ?? 'en',
    fallbackLng: 'pl',
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  });

export default i18n;
