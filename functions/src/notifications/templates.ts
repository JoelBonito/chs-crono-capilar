import type { NotificationType } from "./schemas";

interface TemplateData {
  firstName: string;
  productName?: string;
  productLink?: string;
  treatmentName?: string;
}

/**
 * SMS message templates in French.
 * All messages must be <= 160 characters for single SMS segment.
 */
const TEMPLATES: Record<NotificationType, (data: TemplateData) => string> = {
  rebuy_alert: (data) =>
    `Bonjour ${data.firstName} !\n` +
    `Votre ${data.productName ?? "produit"} est presque épuisé(e).\n` +
    `Renouvelez votre stock : ${data.productLink ?? "https://cronocapilar.inoveai.app.br"}`,

  treatment_reminder: (data) =>
    `Rappel CronoCapilar : c'est l'heure de votre ${data.treatmentName ?? "soin"} ! ` +
    `Consultez votre calendrier pour les détails.`,

  welcome: (data) =>
    `Bienvenue sur CronoCapilar ${data.firstName} !\n` +
    `Commencez votre diagnostic IA pour découvrir votre chronogramme personnalisé.`,
};

/**
 * Render an SMS template with the given data.
 */
export function renderTemplate(type: NotificationType, data: TemplateData): string {
  const render = TEMPLATES[type];
  return render(data);
}
