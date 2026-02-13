import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { ptBR } from "date-fns/locale/pt-BR";
import i18n from "@/i18n";

type DateFnsLocale = typeof fr;

const localeMap: Record<string, DateFnsLocale> = {
  "fr-FR": fr,
  "pt-BR": ptBR,
};

function getLocale(): DateFnsLocale {
  return localeMap[i18n.language] ?? fr;
}

/** Short date: "mer. 5 fév." */
export function formatDateShort(dateStr: string): string {
  return format(new Date(dateStr), "EEE d MMM", { locale: getLocale() });
}

/** Friendly date: "mercredi 5 février" */
export function formatDateFriendly(dateStr: string): string {
  return format(new Date(dateStr), "EEEE d MMMM", { locale: getLocale() });
}
