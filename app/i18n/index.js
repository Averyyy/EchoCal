import {I18n} from 'i18n-js';
import * as RNLocalize from 'react-native-localize';

// Import the translation files
import en from './locales/en.json';

// Create an instance of I18n
const i18n = new I18n({
  en,
  // Add other language translations here
});

// Detect the user's locale and set it
const setI18nConfig = () => {
  const locales = RNLocalize.getLocales();

  if (Array.isArray(locales) && locales.length > 0) {
    const {languageTag} = locales[0]; // Pick the first locale
    i18n.locale = languageTag || 'en'; // Default to 'en' if no locale is detected
  } else {
    i18n.locale = 'en'; // Default to English
  }

  i18n.enableFallback = true; // Fallback to 'en' if a translation is missing
};

// Set the initial locale configuration
setI18nConfig();

export default i18n;
