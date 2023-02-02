import I18n from "i18n-js";
import * as RNLocalize from "react-native-localize";

import en from "../locales/en";
import ar from "../locales/ar";

// const locales = RNLocalize.getLocales();
// if (Array.isArray(locales)) {
//   I18n.locale = locales[0].languageTag ;
// }
I18n.locale = 'en'
I18n.defaultLocale = 'en'
I18n.fallbacks = true;
I18n.translations = {
  en,
  ar
};

export default I18n;
