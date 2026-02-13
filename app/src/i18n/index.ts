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

// Static imports — PT-BR (stubs, filled in Phase 5)
import ptCommon from "./locales/pt-BR/common.json";
import ptAuth from "./locales/pt-BR/auth.json";
import ptDiagnostic from "./locales/pt-BR/diagnostic.json";
import ptCalendar from "./locales/pt-BR/calendar.json";
import ptDashboard from "./locales/pt-BR/dashboard.json";
import ptSettings from "./locales/pt-BR/settings.json";
import ptLanding from "./locales/pt-BR/landing.json";

const SUPPORTED_LANGS = ["fr-FR", "pt-BR"] as const;
const STORAGE_KEY = "chs_locale";

/**
 * Normalize any detected language tag to a supported locale.
 * pt, pt-BR, pt-PT → "pt-BR"; everything else → "fr-FR".
 */
function convertDetectedLanguage(lng: string): string {
  const lower = lng.toLowerCase();
  if (lower === "pt" || lower.startsWith("pt-")) return "pt-BR";
  return "fr-FR";
}

const languageDetector = new LanguageDetector();
languageDetector.addDetector({
  name: "normalizedDetector",
  lookup() {
    // Check localStorage first
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
