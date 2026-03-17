
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import es from './es.json';
import ca from './ca.json';
import en from './en.json';

const translations = {
  es: es,
  en: en,
  ca: ca,
};

const i18n = new I18n(translations);

// Set the locale once at start
const locales = Localization.getLocales();
const deviceLocale = locales && locales.length > 0 ? locales[0].languageCode : 'es';
i18n.locale = deviceLocale || 'es';
i18n.enableFallback = true;
i18n.defaultLocale = 'es';

export default i18n;
