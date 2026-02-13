import { useTranslation } from "react-i18next";
import { Droplets, Leaf, Shield, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { DiagnosticResult as Result } from "../scoring";

interface DiagnosticResultProps {
  result: Result;
  onGenerateSchedule: () => void;
  onRetake?: () => void;
}

const AXIS_CONFIG = {
  H: {
    label: "Hydratation",
    icon: Droplets,
    color: "text-blue-600",
    bg: "bg-blue-100",
    bar: "bg-blue-500",
    ring: "#3b82f6",
  },
  N: {
    label: "Nutrition",
    icon: Leaf,
    color: "text-green-600",
    bg: "bg-green-100",
    bar: "bg-green-500",
    ring: "#22c55e",
  },
  R: {
    label: "Reconstruction",
    icon: Shield,
    color: "text-amber-600",
    bg: "bg-amber-100",
    bar: "bg-amber-500",
    ring: "#f59e0b",
  },
} as const;

export default function DiagnosticResult({ result, onGenerateSchedule, onRetake }: DiagnosticResultProps) {
  const { t } = useTranslation(["diagnostic", "common"]);
  const values = {
    H: result.hydrationNeed,
    N: result.nutritionNeed,
    R: result.reconstructionNeed,
  };

  // Build conic-gradient for donut chart
  const segments = [
    { key: "H" as const, value: values.H },
    { key: "N" as const, value: values.N },
    { key: "R" as const, value: values.R },
  ];
  let cumulative = 0;
  const gradientParts = segments.map((s) => {
    const start = cumulative;
    cumulative += s.value;
    return `${AXIS_CONFIG[s.key].ring} ${start}% ${cumulative}%`;
  });
  const gradient = `conic-gradient(${gradientParts.join(", ")})`;

  return (
    <div className="px-4 pb-20 pt-8">
      <h1 className="font-serif text-h2 text-gray-900">{t("diagnostic:result.title")}</h1>
      <p className="mt-2 text-body text-gray-600">{t(`diagnostic:result.dominant${result.dominantNeed}`)}</p>

      {/* Donut chart */}
      <div className="mt-6 flex justify-center">
        <div
          className="relative h-44 w-44 rounded-full"
          style={{ background: gradient }}
        >
          <div className="absolute inset-4 flex items-center justify-center rounded-full bg-white">
            <div className="text-center">
              <span className={cn("text-h3 font-bold", AXIS_CONFIG[result.dominantNeed].color)}>
                {values[result.dominantNeed]}%
              </span>
              <p className="text-caption text-gray-500">
                {t(`common:treatments.${result.dominantNeed}`)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-4">
        {segments.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5">
            <div className={cn("h-2.5 w-2.5 rounded-full", AXIS_CONFIG[s.key].bar)} />
            <span className="text-caption text-gray-600">
              {t(`common:treatments.${s.key}`)}
            </span>
          </div>
        ))}
      </div>

      {/* Metric cards */}
      <div className="mt-6 space-y-2">
        {segments.map((s) => {
          const config = AXIS_CONFIG[s.key];
          const Icon = config.icon;
          const isDominant = s.key === result.dominantNeed;

          return (
            <div
              key={s.key}
              className={cn(
                "flex items-center gap-3 rounded-md border p-3",
                isDominant ? "border-gold-500 bg-gold-500/5" : "border-gray-200 bg-white",
              )}
            >
              <div className={cn("rounded-md p-2", config.bg)}>
                <Icon className={cn("h-5 w-5", config.color)} />
              </div>
              <div className="flex-1">
                <p className="text-body font-medium text-gray-900">{t(`common:treatments.${s.key}`)}</p>
              </div>
              <span className={cn("text-h4 font-bold", config.color)}>{s.value}%</span>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-8">
        <Button
          variant="primary"
          className="w-full gap-2"
          onClick={onGenerateSchedule}
        >
          {t("diagnostic:result.generateSchedule")}
          <ArrowRight className="h-4 w-4" />
        </Button>
        {onRetake && (
          <Button
            variant="ghost"
            className="mt-3 w-full"
            onClick={onRetake}
          >
            {t("diagnostic:result.retake")}
          </Button>
        )}
      </div>
    </div>
  );
}
