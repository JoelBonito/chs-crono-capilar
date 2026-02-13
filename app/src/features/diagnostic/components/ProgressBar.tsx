import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between text-caption text-gray-500">
        <span>Diagnostic capillaire</span>
        <span>
          {current} sur {total}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={cn("h-full rounded-full bg-gold-500 transition-all duration-normal")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
