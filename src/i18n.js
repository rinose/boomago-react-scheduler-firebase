import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from './locale/en';
import it from './locale/it';

i18n.use(LanguageDetector).init({
  lng: 'it',
  // we init with resources
  resources: {
    en,
    it
  },
  fallbackLng: "en",
  debug: false,
  useSuspense: true,

  // have a common namespace used around the full app
  ns: ["translations"],
  defaultNS: "translations",

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ","
  }
});

export default i18n;