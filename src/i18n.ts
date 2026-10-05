import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// English source text is also the extraction key until catalogs are generated.
void i18next.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  supportedLngs: ['en', 'fr'],
  initAsync: false,
  resources: { en: { translation: {} }, fr: { translation: {} } },
  keySeparator: false,
  nsSeparator: false,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export const t = i18next.t.bind(i18next);
export default i18next;
