import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Static imports — FR-FR (primary)
import frCommon from "./locales/fr-FR/common.json";
import frAuth from "./locales/fr-FR/auth.json";
import frDiagnostic from "./locales/fr-FR/diagnostic.json";
import frCalendar from "./locales/fr-FR/calendar.json";
import frDashboard from "./locales/fr-FR/dashboard.json";
import frSettings from "./locales/fr-FR/settings.json";
import frLanding from "./locales/fr-FR/landing.json";

// Static imports — PT-BR
import ptCommon from "./locales/pt-BR/common.json";
import ptAuth from "./locales/pt-BR/auth.json";
import ptDiagnostic from "./locales/pt-BR/diagnostic.json";
import ptCalendar from "./locales/pt-BR/calendar.json";
import ptDashboard from "./locales/pt-BR/dashboard.json";
import ptSettings from "./locales/pt-BR/settings.json";
import ptLanding from "./locales/pt-BR/landing.json";

// Static imports — EN-US
import enCommon from "./locales/en-US/common.json";
import enAuth from "./locales/en-US/auth.json";
import enDiagnostic from "./locales/en-US/diagnostic.json";
import enCalendar from "./locales/en-US/calendar.json";
import enDashboard from "./locales/en-US/dashboard.json";
import enSettings from "./locales/en-US/settings.json";
import enLanding from "./locales/en-US/landing.json";

// Static imports — ES-ES
import esCommon from "./locales/es-ES/common.json";
import esAuth from "./locales/es-ES/auth.json";
import esDiagnostic from "./locales/es-ES/diagnostic.json";
import esCalendar from "./locales/es-ES/calendar.json";
import esDashboard from "./locales/es-ES/dashboard.json";
import esSettings from "./locales/es-ES/settings.json";
import esLanding from "./locales/es-ES/landing.json";

// Static imports — DE-DE
import deCommon from "./locales/de-DE/common.json";
import deAuth from "./locales/de-DE/auth.json";
import deDiagnostic from "./locales/de-DE/diagnostic.json";
import deCalendar from "./locales/de-DE/calendar.json";
import deDashboard from "./locales/de-DE/dashboard.json";
import deSettings from "./locales/de-DE/settings.json";
import deLanding from "./locales/de-DE/landing.json";

const SUPPORTED_LANGS = ["fr-FR", "pt-BR", "en-US", "es-ES", "de-DE"] as const;
const STORAGE_KEY = "chs_locale";

/**
 * Normalize any detected language tag to a supported locale.
 * en, en-* → "en-US"; es, es-* → "es-ES"; de, de-* → "de-DE";
 * pt, pt-* → "pt-BR"; everything else → "fr-FR".
 */
function convertDetectedLanguage(lng: string): string {
  const lower = lng.toLowerCase();
  if (lower === "en" || lower.startsWith("en-")) return "en-US";
  if (lower === "es" || lower.startsWith("es-")) return "es-ES";
  if (lower === "de" || lower.startsWith("de-")) return "de-DE";
  if (lower === "pt" || lower.startsWith("pt-")) return "pt-BR";
  return "fr-FR";
}

const languageDetector = new LanguageDetector();
languageDetector.addDetector({
  name: "normalizedDetector",
  lookup() {
    // Check localStorage first (exact locale stored by handleChangeLanguage)
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return convertDetectedLanguage(stored);

    // Fall back to browser language
    const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage;
    if (browserLang) return convertDetectedLanguage(browserLang);

    return "fr-FR";
  },
  cacheUserLanguage(lng: string) {
    localStorage.setItem(STORAGE_KEY, lng);
  },
});

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      "fr-FR": {
        common: frCommon,
        auth: frAuth,
        diagnostic: frDiagnostic,
        calendar: frCalendar,
        dashboard: frDashboard,
        settings: frSettings,
        landing: frLanding,
      },
      "pt-BR": {
        common: ptCommon,
        auth: ptAuth,
        diagnostic: ptDiagnostic,
        calendar: ptCalendar,
        dashboard: ptDashboard,
        settings: ptSettings,
        landing: ptLanding,
      },
      "en-US": {
        common: enCommon,
        auth: enAuth,
        diagnostic: enDiagnostic,
        calendar: enCalendar,
        dashboard: enDashboard,
        settings: enSettings,
        landing: enLanding,
      },
      "es-ES": {
        common: esCommon,
        auth: esAuth,
        diagnostic: esDiagnostic,
        calendar: esCalendar,
        dashboard: esDashboard,
        settings: esSettings,
        landing: esLanding,
      },
      "de-DE": {
        common: deCommon,
        auth: deAuth,
        diagnostic: deDiagnostic,
        calendar: deCalendar,
        dashboard: deDashboard,
        settings: deSettings,
        landing: deLanding,
      },
    },
    fallbackLng: "fr-FR",
    supportedLngs: [...SUPPORTED_LANGS],
    defaultNS: "common",
    ns: ["common", "auth", "diagnostic", "calendar", "dashboard", "settings", "landing"],
    detection: {
      order: ["normalizedDetector"],
      lookupLocalStorage: STORAGE_KEY,
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false, // React handles XSS
    },
  });

export default i18n;
