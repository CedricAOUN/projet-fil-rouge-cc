import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../translations/en.json';
import fr from '../translations/fr.json';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

function initialLanguage(): 'en' | 'fr' {
  try {
    const saved = localStorage.getItem('language');
    if (saved === 'en' || saved === 'fr') return saved;
  } catch {
    // Browser preferences still work when storage is blocked.
  }
  const languages = typeof navigator === 'undefined'
    ? []
    : navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const locale of languages) {
    const language = locale?.toLowerCase().split(/[-_]/)[0];
    if (language === 'en' || language === 'fr') return language;
  }
  return 'en';
}

// English source text remains the extraction key for both catalogs.
void i18next.use(initReactI18next).init({
  lng: initialLanguage(),
  fallbackLng: 'en',
  supportedLngs: ['en', 'fr'],
  initAsync: false,
  resources: { en: { translation: en }, fr: { translation: fr } },
  returnEmptyString: false,
  keySeparator: false,
  nsSeparator: false,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

dayjs.locale(i18next.resolvedLanguage ?? 'en');

i18next.on('languageChanged', (language) => {
  dayjs.locale(language);
});

export function setLanguagePreference(language: 'en' | 'fr') {
  try {
    localStorage.setItem('language', language);
  } catch {
    // Language switching remains available when storage is blocked.
  }
  return i18next.changeLanguage(language);
}

export const t = i18next.t.bind(i18next);
export default i18next;
