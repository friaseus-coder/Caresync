
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import es from './es.json';
import ca from './ca.json';
import en from './en.json';

const i18n = new I18n({
  es,
  ca,
  en,
});

i18n.locale = Localization.locale;
i18n.enableFallback = true;

export default i18n;
