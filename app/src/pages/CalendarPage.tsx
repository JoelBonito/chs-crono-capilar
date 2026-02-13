import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { Calendar, Download, ExternalLink, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { db } from "@/lib/firebase";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { downloadICSFile, syncToCalendar } from "@/services/calendarSync";
import { getDeviceInfo } from "@/lib/device";
import { generateSchedule } from "@/services/schedule";

type TreatmentType = "H" | "N" | "R";

interface CalendarEvent {
  date: string;
  dayOfWeek: number;
  treatment: TreatmentType;
  weekNumber: number;
  label: string;
}

interface Schedule {
  id: string;
  calendarToken: string;
  calendarEvents: CalendarEvent[];
  sequence: TreatmentType[];
  daysOfWeek: number[];
  time: string;
  startAt: { toDate: () => Date } | string;
  status: string;
}

const TREATMENT_COLORS: Record<TreatmentType, string> = {
  H: "bg-blue-100 text-blue-800",
  N: "bg-green-100 text-green-800",
  R: "bg-amber-100 text-amber-800",
};

const TREATMENT_EMOJI: Record<TreatmentType, string> = {
  H: "\uD83E\uDDF4",
  N: "\uD83C\uDF3F",
  R: "\uD83D\uDD27",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(i18n.language, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function CalendarPage() {
  const { user, firebaseUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(["calendar", "common"]);
  const navDiagnosticId = (location.state as { diagnosticId?: string } | null)?.diagnosticId;

  const dayNames = t("common:days.short", { returnObjects: true }) as string[];

  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Schedule configuration state
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 3, 5]); // Mon, Wed, Fri
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0]!;
  });

  useEffect(() => {
    if (!user) return;

    async function fetchSchedule() {
      try {
        const q = query(
          collection(db, "schedules"),
          where("userId", "==", user!.uid),
          where("status", "==", "active"),
          orderBy("createdAt", "desc"),
          limit(1),
        );
        const snap = await getDocs(q);

        if (snap.empty) {
          setSchedule(null);
          setEvents([]);
          setLoading(false);
          return;
        }

        const doc = snap.docs[0]!;
        const data = doc.data();

        // Rebuild events from stored data if not stored directly
        const startAt = data.startAt?.toDate
          ? data.startAt.toDate().toISOString()
          : data.startAt;

        const storedSchedule: Schedule = {
          id: doc.id,
          calendarToken: data.calendarToken ?? "",
          calendarEvents: data.calendarEvents ?? [],
          sequence: data.sequence ?? [],
          daysOfWeek: data.daysOfWeek ?? [],
          time: data.time ?? "20:00",
          startAt,
          status: data.status,
        };

        setSchedule(storedSchedule);

        // If calendarEvents are not stored in Firestore, we need to rebuild from the service
        // For now, we'll rebuild them client-side using the same logic
        if (storedSchedule.calendarEvents.length > 0) {
          setEvents(storedSchedule.calendarEvents);
        } else {
          // Rebuild from sequence data
          const rebuilt = rebuildEvents(
            storedSchedule.sequence,
            startAt,
            storedSchedule.daysOfWeek,
            storedSchedule.time,
          );
          setEvents(rebuilt);
        }
      } catch {
        setError(t("calendar:errors.loadFailed"));
      } finally {
        setLoading(false);
      }
    }

    fetchSchedule();
  }, [user, t]);

  async function handleDownloadICS() {
    if (!schedule) return;
    setDownloading(true);
    try {
      await downloadICSFile(schedule.id, schedule.calendarToken);
    } catch {
      setError(t("calendar:errors.downloadFailed"));
    } finally {
      setDownloading(false);
    }
  }

  const [syncing, setSyncing] = useState(false);

  async function handleSyncCalendar() {
    if (!schedule) return;
    setSyncing(true);
    try {
      await syncToCalendar(schedule.id, schedule.calendarToken);
    } catch {
      setError(t("calendar:errors.syncFailed"));
    } finally {
      setSyncing(false);
    }
  }

  async function handleGenerate() {
    if (!user || !firebaseUser || !navDiagnosticId) return;
    setGenerating(true);
    setError(null);
    try {
      const idToken = await firebaseUser.getIdToken();
      const result = await generateSchedule(
        {
          diagnosticId: navDiagnosticId,
          userId: user.uid,
          startAt: `${startDate}T00:00:00Z`,
          daysOfWeek: selectedDays,
          time: "20:00",
        },
        idToken,
      );

      const newSchedule: Schedule = {
        id: result.scheduleId,
        calendarToken: result.calendarToken,
        calendarEvents: result.calendarEvents,
        sequence: result.sequence,
        daysOfWeek: selectedDays,
        time: "20:00",
        startAt: startDate,
        status: "active",
      };
      setSchedule(newSchedule);
      setEvents(result.calendarEvents);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("calendar:errors.generateFailed"),
      );
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center px-4 pb-20 pt-16 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-gold-500" />
        <p className="mt-4 text-body text-gray-600">{t("calendar:loading")}</p>
      </div>
    );
  }

  if (!schedule || events.length === 0) {
    // Case A: Has diagnosticId from navigation -- show schedule configuration
    if (navDiagnosticId) {
      return (
        <div className="px-4 pb-20 pt-8">
          <h1 className="font-serif text-h2 text-gray-900">
            {t("calendar:create.title")}
          </h1>
          <p className="mt-2 text-body text-gray-600">
            {t("calendar:create.subtitle")}
          </p>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-3 text-body-sm text-red-700">
              {error}
            </div>
          )}

          {/* Day picker */}
          <div className="mt-6">
            <label className="text-body font-medium text-gray-900">
              {t("calendar:create.daysLabel")}
            </label>
            <p className="mt-1 text-caption text-gray-500">
              {t("calendar:create.daysHint")}
            </p>
            <div className="mt-3 flex gap-2">
              {dayNames.map((name, idx) => {
                const isSelected = selectedDays.includes(idx);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        if (selectedDays.length > 2) {
                          setSelectedDays(selectedDays.filter((d) => d !== idx));
                        }
                      } else {
                        if (selectedDays.length < 4) {
                          setSelectedDays([...selectedDays, idx].sort((a, b) => a - b));
                        }
                      }
                    }}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full text-caption font-medium transition-colors",
                      isSelected
                        ? "bg-gold-500 text-white"
                        : "border border-gray-300 text-gray-600 hover:border-gold-500",
                    )}
                  >
                    {name.slice(0, 2)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Start date */}
          <div className="mt-6">
            <label className="text-body font-medium text-gray-900">
              {t("calendar:create.startDate")}
            </label>
            <input
              type="date"
              value={startDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-body text-gray-900"
            />
          </div>

          {/* Generate button */}
          <div className="mt-8">
            <Button
              variant="primary"
              className="w-full gap-2"
              onClick={handleGenerate}
              disabled={generating || selectedDays.length < 2}
            >
              {generating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t("calendar:create.generating")}
                </>
              ) : (
                <>
                  <Calendar className="h-5 w-5" />
                  {t("calendar:create.generate")}
                </>
              )}
            </Button>
          </div>
        </div>
      );
    }

    // Case B: No diagnosticId -- prompt user to do diagnostic first
    return (
      <div className="flex flex-col items-center justify-center px-4 pb-20 pt-16 text-center">
        <Calendar className="h-16 w-16 text-gold-500" />
        <h1 className="mt-6 font-serif text-h2 text-gray-900">{t("calendar:empty.title")}</h1>
        <p className="mt-2 max-w-sm text-body text-gray-600">
          {t("calendar:empty.description")}
        </p>
        <Button
          variant="primary"
          className="mt-6"
          onClick={() => navigate("/diagnostic")}
        >
          {t("calendar:empty.button")}
        </Button>
      </div>
    );
  }

  // Group events by week
  const eventsByWeek = events.reduce<Record<number, CalendarEvent[]>>((acc, event) => {
    const week = event.weekNumber;
    if (!acc[week]) acc[week] = [];
    acc[week].push(event);
    return acc;
  }, {});

  return (
    <div className="px-4 pb-24 pt-8">
      <h1 className="font-serif text-h2 text-gray-900">{t("calendar:title")}</h1>
      <p className="mt-1 text-body-sm text-gray-600">
        {t("calendar:sessionCount", { count: events.length })}
      </p>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-3 text-body-sm text-red-700">
          {error}
        </div>
      )}

      {/* Weekly event list */}
      <div className="mt-6 space-y-6">
        {Object.entries(eventsByWeek)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([week, weekEvents]) => (
            <section key={week}>
              <h2 className="font-sans text-h4 text-gray-900">
                {t("calendar:week", { number: week })}
              </h2>
              <div className="mt-2 space-y-2">
                {weekEvents.map((event, idx) => (
                  <div
                    key={`${week}-${idx}`}
                    className="flex items-center gap-3 rounded-md border border-gray-200 bg-white p-3"
                  >
                    <span
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-lg ${TREATMENT_COLORS[event.treatment]}`}
                    >
                      {TREATMENT_EMOJI[event.treatment]}
                    </span>
                    <div className="flex-1">
                      <p className="font-sans text-body font-medium text-gray-900">
                        {event.label}
                      </p>
                      <p className="text-body-sm text-gray-500">
                        {formatDate(event.date)} · {dayNames[event.dayOfWeek]}
                      </p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TREATMENT_COLORS[event.treatment]}`}>
                      {event.treatment}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
      </div>

      {/* Export buttons */}
      <div className="mt-8 space-y-3">
        <Button
          variant="primary"
          className="w-full gap-2"
          onClick={handleSyncCalendar}
          disabled={syncing}
        >
          {syncing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ExternalLink className="h-5 w-5" />
          )}
          {getDeviceInfo().isMobile
            ? t("calendar:sync.mobile")
            : t("calendar:sync.desktop")}
        </Button>
        <Button
          variant="secondary"
          className="w-full gap-2"
          onClick={handleDownloadICS}
          disabled={downloading}
        >
          {downloading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Download className="h-5 w-5" />
          )}
          {getDeviceInfo().isMobile
            ? t("calendar:download.mobile")
            : t("calendar:download.desktop")}
        </Button>
      </div>
    </div>
  );
}

/**
 * Client-side rebuild of calendar events from stored schedule data.
 * Mirrors the backend buildCalendarEvents logic.
 */
function rebuildEvents(
  sequence: TreatmentType[],
  startAt: string,
  daysOfWeek: number[],
  time: string,
): CalendarEvent[] {
  const treatmentLabels: Record<TreatmentType, string> = {
    H: i18n.t("common:treatments.H"),
    N: i18n.t("common:treatments.N"),
    R: i18n.t("common:treatments.R"),
  };

  const sortedDays = [...daysOfWeek].sort((a, b) => a - b);
  const start = new Date(startAt);
  const events: CalendarEvent[] = [];
  let sessionIndex = 0;

  for (let week = 0; week < 4; week++) {
    for (const targetDay of sortedDays) {
      if (sessionIndex >= sequence.length) break;

      const date = new Date(start);
      date.setDate(date.getDate() + week * 7);

      const currentDay = date.getDay();
      let diff = targetDay - currentDay;
      if (diff < 0) diff += 7;
      date.setDate(date.getDate() + diff);

      const treatment = sequence[sessionIndex]!;
      const isoDate = date.toISOString().split("T")[0]!;

      events.push({
        date: `${isoDate}T${time}:00`,
        dayOfWeek: targetDay,
        treatment,
        weekNumber: week + 1,
        label: treatmentLabels[treatment],
      });

      sessionIndex++;
    }
  }

  return events;
}
