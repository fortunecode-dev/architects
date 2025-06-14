// src/i18n.ts
import i18n from "i18next";
import en from "./locales/en";
import es from "./locales/es";

// Type for your translation resources
type TranslationResources = {
  translation: typeof en;
};

// Type for your supported languages
type SupportedLanguages = {
  en: TranslationResources;
  // Add other languages here when needed
};

const resources: SupportedLanguages = {
  en: {
    translation: en,
  },
  // Add other languages here with the same structure
};

i18n.init({
  lng: "en", // if you're using a language detector, do not define the lng option
  debug: true,
  resources: {
    en: {
      translation: en,
    },
    es: {
      translation: es,
    },
  },
});

export default i18n;
