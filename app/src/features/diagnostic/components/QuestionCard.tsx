import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Question } from "../questions";

interface QuestionCardProps {
  question: Question;
  answer: string | string[] | undefined;
  onAnswer: (questionId: string, value: string | string[]) => void;
}

export default function QuestionCard({ question, answer, onAnswer }: QuestionCardProps) {
  const { t } = useTranslation("diagnostic");
  const isSingle = question.tipo === "single_choice";
  const selectedValues = answer ? (Array.isArray(answer) ? answer : [answer]) : [];

  function handleOptionClick(valor: string) {
    if (isSingle) {
      onAnswer(question.id, valor);
      return;
    }

    // Multiple choice toggle
    const next = selectedValues.includes(valor)
      ? selectedValues.filter((v) => v !== valor)
      : [...selectedValues, valor];

    // Enforce max selection
    if (question.max_selecao && next.length > question.max_selecao) return;

    onAnswer(question.id, next);
  }

  return (
    <div>
      <h2 className="font-serif text-h3 text-gray-900">{question.pergunta}</h2>
      {question.subtitulo && (
        <p className="mt-1 text-body-sm text-gray-500">{question.subtitulo}</p>
      )}

      {!isSingle && question.max_selecao && (
        <p className="mt-2 text-caption text-gray-400">
          {t("questionCard.selected", { count: selectedValues.length, max: question.max_selecao })}
        </p>
      )}

      <div className="mt-4 space-y-2">
        {question.opcoes.map((option) => {
          const isSelected = selectedValues.includes(option.valor);

          return (
            <button
              key={option.valor}
              type="button"
              onClick={() => handleOptionClick(option.valor)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left",
                "transition-colors duration-fast",
                isSelected
                  ? "border-gold-500 bg-gold-500/5"
                  : "border-gray-200 bg-white hover:border-gray-300",
              )}
            >
              {/* Selection indicator */}
              <div
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-fast",
                  isSelected ? "border-gold-500 bg-gold-500" : "border-gray-300",
                  !isSingle && "rounded",
                )}
              >
                {isSelected && <Check className="h-3 w-3 text-white" />}
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-body text-gray-900">{option.texto}</span>
                {option.descricao && (
                  <p className="mt-0.5 text-caption text-gray-500">{option.descricao}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
