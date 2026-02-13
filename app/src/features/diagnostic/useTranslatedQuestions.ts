import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { QUESTIONS, CONTEXTUAL_BRIDGES, type Question } from "./questions";

/**
 * Hook that overlays i18n translations onto QUESTIONS without altering scoring data.
 * Only replaces user-visible text fields: pergunta, subtitulo, texto, descricao.
 * Scoring fields (valor, peso, obrigatoria, nivel, tipo, min_selecao, max_selecao) remain untouched.
 */
export function useTranslatedQuestions() {
  const { t } = useTranslation("diagnostic");

  const translatedQuestions = useMemo((): Question[] => {
    return QUESTIONS.map((q) => ({
      ...q,
      pergunta: t(`questions.${q.id}.question`, { defaultValue: q.pergunta }),
      subtitulo: q.subtitulo
        ? t(`questions.${q.id}.subtitle`, { defaultValue: q.subtitulo })
        : undefined,
      opcoes: q.opcoes.map((opt) => ({
        ...opt, // preserves valor, peso
        texto: t(`questions.${q.id}.options.${opt.valor}.text`, { defaultValue: opt.texto }),
        descricao: opt.descricao
          ? t(`questions.${q.id}.options.${opt.valor}.description`, { defaultValue: opt.descricao })
          : undefined,
      })),
    }));
  }, [t]);

  const translatedBridges = useMemo((): Record<string, string> => {
    const result: Record<string, string> = {};
    for (const [key, defaultText] of Object.entries(CONTEXTUAL_BRIDGES)) {
      result[key] = t(`bridges.${key}`, { defaultValue: defaultText });
    }
    return result;
  }, [t]);

  return { translatedQuestions, translatedBridges };
}
