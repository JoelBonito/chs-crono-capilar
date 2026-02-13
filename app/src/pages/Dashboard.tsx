import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import {
  ScanFace,
  Calendar,
  ChevronRight,
  Droplets,
  Leaf,
  Wrench,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { db } from "@/lib/firebase";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types (local to Dashboard)
// ---------------------------------------------------------------------------

type TreatmentType = "H" | "N" | "R";

interface DiagnosticSummary {
  id: string;
  hydrationNeed: number;
  nutritionNeed: number;
  reconstructionNeed: number;
  dominantNeed: TreatmentType;
  createdAt: Date;
}

interface CalendarEvent {
  date: string;
  treatment: TreatmentType;
  label: string;
  weekNumber: number;
}

interface ScheduleSummary {
  id: string;
  calendarEvents: CalendarEvent[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TREATMENT_COLORS: Record<TreatmentType, string> = {
  H: "bg-blue-100 text-blue-800",
  N: "bg-green-100 text-green-800",
  R: "bg-amber-100 text-amber-800",
};

const TREATMENT_BAR_COLORS: Record<TreatmentType, string> = {
  H: "bg-blue-500",
  N: "bg-green-500",
  R: "bg-amber-500",
};

const TREATMENT_ICONS: Record<TreatmentType, typeof Droplets> = {
  H: Droplets,
  N: Leaf,
  R: Wrench,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getGreetingSubtext(
  diagnostic: DiagnosticSummary | null,
  schedule: ScheduleSummary | null,
): string {
  if (!diagnostic) {
    return i18n.t("dashboard:subtexts.welcome");
  }
  if (!schedule) {
    return i18n.t("dashboard:subtexts.diagnosticReady");
  }
  const next = findNextEvent(schedule.calendarEvents);
  if (next) {
    return i18n.t("dashboard:subtexts.nextTreatment", {
      date: formatDateFriendly(next.date),
    });
  }
  return i18n.t("dashboard:subtexts.completed");
}

function findNextEvent(events: CalendarEvent[]): CalendarEvent | null {
  const now = new Date();
  const upcoming = events
    .filter((e) => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return upcoming[0] ?? null;
}

function formatDateFriendly(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(i18n.language, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function getWeekProgress(events: CalendarEvent[]): {
  currentWeek: number;
  totalWeeks: number;
  remainingThisWeek: number;
} | null {
  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.date) >= now);
  if (upcoming.length === 0) return null;

  const nextEvent = upcoming[0]!;
  const currentWeek = nextEvent.weekNumber;
  const totalWeeks = Math.max(...events.map((e) => e.weekNumber));
  const remainingThisWeek = upcoming.filter(
    (e) => e.weekNumber === currentWeek,
  ).length;

  return { currentWeek, totalWeeks, remainingThisWeek };
}

function deriveDominantNeed(h: number, n: number, r: number): TreatmentType {
  if (h >= n && h >= r) return "H";
  if (n >= h && n >= r) return "N";
  return "R";
}

// ---------------------------------------------------------------------------
// Sub-components (inline)
// ---------------------------------------------------------------------------

function StartDiagnosticCard() {
  const { t } = useTranslation(["dashboard", "common"]);

  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 p-6 text-center">
      <ScanFace className="mx-auto h-12 w-12 text-gold-500" />
      <h2 className="mt-4 font-sans text-h4 text-gray-900">
        {t("dashboard:startDiagnostic.title")}
      </h2>
      <p className="mt-2 text-body-sm text-gray-600">
        {t("dashboard:startDiagnostic.description")}
      </p>
      <Link to="/diagnostic" className="mt-4 inline-block">
        <Button variant="primary">{t("dashboard:startDiagnostic.button")}</Button>
      </Link>
    </div>
  );
}

function CreateScheduleCard({ diagnosticId }: { diagnosticId: string }) {
  const { t } = useTranslation(["dashboard", "common"]);
  const navigate = useNavigate();

  return (
    <div className="rounded-md border border-gold-500/30 bg-gold-500/5 p-6 text-center">
      <Calendar className="mx-auto h-12 w-12 text-gold-500" />
      <h2 className="mt-4 font-sans text-h4 text-gray-900">
        {t("dashboard:createSchedule.title")}
      </h2>
      <p className="mt-2 text-body-sm text-gray-600">
        {t("dashboard:createSchedule.description")}
      </p>
      <Button
        variant="primary"
        className="mt-4"
        onClick={() =>
          navigate("/calendrier", { state: { diagnosticId } })
        }
      >
        {t("dashboard:createSchedule.button")}
      </Button>
    </div>
  );
}

function DiagnosticSummaryCard({
  diagnostic,
}: {
  diagnostic: DiagnosticSummary;
}) {
  const { t } = useTranslation(["dashboard", "common"]);

  const needs: { type: TreatmentType; value: number }[] = [
    { type: "H", value: diagnostic.hydrationNeed },
    { type: "N", value: diagnostic.nutritionNeed },
    { type: "R", value: diagnostic.reconstructionNeed },
  ];

  return (
    <div className="rounded-md border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-sans text-h4 text-gray-900">{t("dashboard:profile.title")}</h3>
        <Link
          to="/diagnostic"
          className="flex items-center gap-1 text-caption text-gold-700 transition-colors duration-fast hover:text-gold-500"
        >
          {t("dashboard:profile.details")}
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {needs.map(({ type, value }) => {
          const isDominant = type === diagnostic.dominantNeed;
          return (
            <div key={type} className="space-y-1">
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "text-body-sm",
                    isDominant ? "font-medium text-gray-900" : "text-gray-600",
                  )}
                >
                  {t(`common:treatments.${type}`)}
                  {isDominant && (
                    <span className="ml-1.5 inline-block rounded-full bg-gold-500/15 px-1.5 py-0.5 text-[0.625rem] font-semibold leading-none text-gold-700">
                      {t("common:dominant")}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "text-caption tabular-nums",
                    isDominant ? "font-semibold text-gray-900" : "text-gray-500",
                  )}
                >
                  {value}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-slow",
                    TREATMENT_BAR_COLORS[type],
                    isDominant && "opacity-100",
                    !isDominant && "opacity-60",
                  )}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NextTreatmentCard({ schedule }: { schedule: ScheduleSummary }) {
  const { t } = useTranslation(["dashboard", "common"]);
  const nextEvent = findNextEvent(schedule.calendarEvents);
  const weekProgress = getWeekProgress(schedule.calendarEvents);

  if (!nextEvent) {
    return (
      <div className="rounded-md border border-green-200 bg-green-50 p-4 text-center">
        <p className="font-sans text-h4 text-green-800">
          {t("dashboard:scheduleCompleted.title")}
        </p>
        <p className="mt-1 text-body-sm text-green-700">
          {t("dashboard:scheduleCompleted.description")}
        </p>
      </div>
    );
  }

  const Icon = TREATMENT_ICONS[nextEvent.treatment];
  const remainingCount = weekProgress?.remainingThisWeek ?? 0;

  return (
    <Link to="/calendrier" className="block">
      <div className="rounded-md border border-gray-200 bg-white p-4 transition-shadow duration-fast hover:shadow-md">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
              TREATMENT_COLORS[nextEvent.treatment],
            )}
          >
            <Icon className="h-5 w-5" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-caption uppercase tracking-wider text-gray-400">
              {t("dashboard:nextTreatment.label")}
            </p>
            <p className="mt-0.5 font-sans text-body font-medium text-gray-900">
              {nextEvent.label}
            </p>
            <p className="mt-0.5 text-body-sm text-gray-500">
              {formatDateFriendly(nextEvent.date)}
            </p>
          </div>

          <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-gray-300" />
        </div>

        {weekProgress && (
          <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-gold-500 transition-all duration-slow"
                style={{
                  width: `${(weekProgress.currentWeek / weekProgress.totalWeeks) * 100}%`,
                }}
              />
            </div>
            <span className="shrink-0 text-caption text-gray-500">
              {t("dashboard:nextTreatment.week", {
                current: weekProgress.currentWeek,
                total: weekProgress.totalWeeks,
              })}
              {" \u00b7 "}
              {remainingCount > 1
                ? t("dashboard:nextTreatment.remainingPlural", { count: remainingCount })
                : t("dashboard:nextTreatment.remaining", { count: remainingCount })}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <div className="px-4 pb-20 pt-8">
      {/* Greeting skeleton */}
      <div className="h-8 w-48 animate-pulse rounded-md bg-gray-100" />
      <div className="mt-3 h-5 w-72 animate-pulse rounded-md bg-gray-100" />

      {/* Card skeletons */}
      <div className="mt-6 space-y-4">
        <div className="h-24 animate-pulse rounded-md bg-gray-100" />
        <div className="h-40 animate-pulse rounded-md bg-gray-100" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation(["dashboard", "common"]);
  const [diagnostic, setDiagnostic] = useState<DiagnosticSummary | null>(null);
  const [schedule, setSchedule] = useState<ScheduleSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchDashboardData() {
      try {
        // Fetch diagnostic and schedule in parallel
        const [diagSnap, schedSnap] = await Promise.all([
          getDocs(
            query(
              collection(db, "diagnostics"),
              where("userId", "==", user!.uid),
              where("status", "==", "completed"),
              orderBy("createdAt", "desc"),
              limit(1),
            ),
          ),
          getDocs(
            query(
              collection(db, "schedules"),
              where("userId", "==", user!.uid),
              where("status", "==", "active"),
              orderBy("createdAt", "desc"),
              limit(1),
            ),
          ),
        ]);

        // Parse diagnostic
        if (!diagSnap.empty) {
          const doc = diagSnap.docs[0]!;
          const data = doc.data();
          const h = data.hydrationNeed ?? data.hydration ?? 0;
          const n = data.nutritionNeed ?? data.nutrition ?? 0;
          const r = data.reconstructionNeed ?? data.reconstruction ?? 0;

          setDiagnostic({
            id: doc.id,
            hydrationNeed: h,
            nutritionNeed: n,
            reconstructionNeed: r,
            dominantNeed:
              data.dominantNeed ?? deriveDominantNeed(h, n, r),
            createdAt: data.createdAt?.toDate?.() ?? new Date(),
          });
        }

        // Parse schedule
        if (!schedSnap.empty) {
          const doc = schedSnap.docs[0]!;
          const data = doc.data();
          setSchedule({
            id: doc.id,
            calendarEvents: data.calendarEvents ?? [],
          });
        }
      } catch (err) {
        // Silently degrade: show the no-data state
        console.error("Dashboard data fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="px-4 pb-20 pt-8">
      {/* Greeting */}
      <h1 className="font-serif text-h2 text-gray-900">
        {t("dashboard:greeting", { name: user?.firstName ?? "" })}
      </h1>
      <p className="mt-2 text-body text-gray-600">
        {getGreetingSubtext(diagnostic, schedule)}
      </p>

      {/* Cards */}
      <div className="mt-6 space-y-4">
        {/* Next treatment card (only when schedule exists) */}
        {schedule && <NextTreatmentCard schedule={schedule} />}

        {/* Diagnostic summary card (only when diagnostic exists) */}
        {diagnostic && <DiagnosticSummaryCard diagnostic={diagnostic} />}

        {/* CTA cards based on user state */}
        {!diagnostic && <StartDiagnosticCard />}
        {diagnostic && !schedule && (
          <CreateScheduleCard diagnosticId={diagnostic.id} />
        )}
      </div>
    </div>
  );
}
