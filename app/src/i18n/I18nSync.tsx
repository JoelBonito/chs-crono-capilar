import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/auth/AuthContext";

/**
 * Syncs i18n language with the authenticated user's locale preference.
 * When logged in and user.locale differs from current language, updates i18n.
 * When logged out, browser detection handles language selection.
 * Renders nothing — mount inside AuthProvider.
 */
export function I18nSync() {
  const { user } = useAuth();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (user?.locale && user.locale !== i18n.language) {
      i18n.changeLanguage(user.locale);
    }
  }, [user?.locale, i18n]);

  return null;
}
