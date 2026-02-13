import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { Calendar, Download, ExternalLink, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { downloadICSFile, getGoogleCalendarUrl } from "@/services/calendarSync";
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

const DAY_NAMES = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function CalendarPage() {
  const { user, firebaseUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navDiagnosticId = (location.state as { diagnosticId?: string } | null)?.diagnosticId;

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
        setError("Impossible de charger votre chronogramme.");
      } finally {
        setLoading(false);
      }
    }

    fetchSchedule();
  }, [user]);

  async function handleDownloadICS() {
    if (!schedule) return;
    setDownloading(true);
    try {
      await downloadICSFile(schedule.id, schedule.calendarToken);
    } catch {
      setError("Erreur lors du téléchargement du fichier .ics");
    } finally {
      setDownloading(false);
    }
  }

  function handleSyncGoogle() {
    if (!schedule) return;
    const url = getGoogleCalendarUrl(schedule.id, schedule.calendarToken);
    window.open(url, "_blank", "noopener,noreferrer");
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
          : "Impossible de créer le chronogramme. Vérifiez que le serveur est en marche.",
      );
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center px-4 pb-20 pt-16 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-gold-500" />
        <p className="mt-4 text-body text-gray-600">Chargement de votre calendrier...</p>
      </div>
    );
  }

  if (!schedule || events.length === 0) {
    // Case A: Has diagnosticId from navigation -- show schedule configuration
    if (navDiagnosticId) {
      return (
        <div className="px-4 pb-20 pt-8">
          <h1 className="font-serif text-h2 text-gray-900">
            Créer votre chronogramme
          </h1>
          <p className="mt-2 text-body text-gray-600">
            Choisissez vos jours de soins pour générer votre calendrier personnalisé.
          </p>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-3 text-body-sm text-red-700">
              {error}
            </div>
          )}

          {/* Day picker */}
          <div className="mt-6">
            <label className="text-body font-medium text-gray-900">
              Jours de soins
            </label>
            <p className="mt-1 text-caption text-gray-500">
              Sélectionnez 2 à 4 jours par semaine
            </p>
            <div className="mt-3 flex gap-2">
              {DAY_NAMES.map((name, idx) => {
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
              Date de début
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
                  Génération en cours...
                </>
              ) : (
                <>
                  <Calendar className="h-5 w-5" />
                  Générer mon chronogramme
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
        <h1 className="mt-6 font-serif text-h2 text-gray-900">Calendrier</h1>
        <p className="mt-2 max-w-sm text-body text-gray-600">
          Complétez d'abord votre diagnostic pour obtenir votre chronogramme capillaire personnalisé.
        </p>
        <Button
          variant="primary"
          className="mt-6"
          onClick={() => navigate("/diagnostic")}
        >
          Faire le diagnostic
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
      <h1 className="font-serif text-h2 text-gray-900">Mon Chronogramme</h1>
      <p className="mt-1 text-body-sm text-gray-600">
        {events.length} séances sur 4 semaines
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
                Semaine {week}
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
                        {formatDate(event.date)} · {DAY_NAMES[event.dayOfWeek]}
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
          onClick={handleSyncGoogle}
        >
          <ExternalLink className="h-5 w-5" />
          Synchroniser avec Google Calendar
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
          Télécharger .ics
        </Button>
      </div>
    </div>
  );
}

const TREATMENT_LABELS: Record<TreatmentType, string> = {
  H: "Hydratation",
  N: "Nutrition",
  R: "Reconstruction",
};

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
        label: TREATMENT_LABELS[treatment],
      });

      sessionIndex++;
    }
  }

  return events;
}
