import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { app } from "./firebase";

export function initAppCheck() {
  if (import.meta.env.VITE_USE_EMULATORS === "true") {
    return;
  }

  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  if (!siteKey) {
    console.warn("[AppCheck] VITE_RECAPTCHA_SITE_KEY not set — skipping App Check initialization.");
    return;
  }

  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(siteKey),
    isTokenAutoRefreshEnabled: true,
  });
}
