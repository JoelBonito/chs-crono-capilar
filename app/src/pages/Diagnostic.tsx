import { useReducer, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { doc, setDoc, serverTimestamp, collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Loader2, ArrowLeft, ArrowRight, SkipForward } from "lucide-react";

import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";

import { getAdaptiveQuestions } from "@/features/diagnostic/conditionalLogic";
import { useTranslatedQuestions } from "@/features/diagnostic/useTranslatedQuestions";
import {
  accumulateScores,
  normalizeScores,
  validateResult,
  combineWithPhotoAnalysis,
  mapToHairType,
  mapToPorosity,
  type DiagnosticResult as DiagResult,
} from "@/features/diagnostic/scoring";
import { analyzeHair } from "@/services/diagnostic";

import QuestionCard from "@/features/diagnostic/components/QuestionCard";
import ProgressBar from "@/features/diagnostic/components/ProgressBar";
import PhotoUpload from "@/features/diagnostic/components/PhotoUpload";
import DiagnosticResultView from "@/features/diagnostic/components/DiagnosticResult";

// --- Auto-save helpers ---

const STORAGE_KEY = "chs_diagnostic_autosave";
const AUTOSAVE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24h

function saveProgress(answers: Record<string, string | string[]>, questionIndex: number) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, questionIndex, savedAt: Date.now() }));
  } catch { /* ignore storage errors */ }
}

function loadProgress(): { answers: Record<string, string | string[]>; questionIndex: number } | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    const data = JSON.parse(saved);
    if (Date.now() - data.savedAt > AUTOSAVE_EXPIRY_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return { answers: data.answers, questionIndex: data.questionIndex };
  } catch { return null; }
}

function clearProgress() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

// --- State machine ---

type Step = "questions" | "photo" | "processing" | "results";

interface State {
  step: Step;
  answers: Record<string, string | string[]>;
  questionIndex: number;
  photos: File[];
  result: DiagResult | null;
  diagnosticId: string | null;
  error: string | null;
  isRetake: boolean;
}

type Action =
  | { type: "RESTORE"; answers: Record<string, string | string[]>; questionIndex: number }
  | { type: "ANSWER"; questionId: string; value: string | string[] }
  | { type: "NEXT_QUESTION" }
  | { type: "PREV_QUESTION" }
  | { type: "SKIP_OPTIONAL" }
  | { type: "GO_TO_PHOTO" }
  | { type: "SUBMIT_PHOTOS"; files: File[] }
  | { type: "SKIP_PHOTO" }
  | { type: "PROCESSING" }
  | { type: "SET_RESULT"; result: DiagResult; diagnosticId: string }
  | { type: "SET_ERROR"; error: string }
  | { type: "RESTART" };

const initialState: State = {
  step: "questions",
  answers: {},
  questionIndex: 0,
  photos: [],
  result: null,
  diagnosticId: null,
  error: null,
  isRetake: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "RESTORE":
      return { ...state, answers: action.answers, questionIndex: action.questionIndex };
    case "ANSWER":
      return { ...state, answers: { ...state.answers, [action.questionId]: action.value } };
    case "NEXT_QUESTION":
      return { ...state, questionIndex: state.questionIndex + 1 };
    case "PREV_QUESTION":
      return { ...state, questionIndex: Math.max(0, state.questionIndex - 1) };
    case "SKIP_OPTIONAL":
      return { ...state, questionIndex: state.questionIndex + 1 };
    case "GO_TO_PHOTO":
      return { ...state, step: "photo" };
    case "SUBMIT_PHOTOS":
      return { ...state, photos: action.files, step: "processing" };
    case "SKIP_PHOTO":
      return { ...state, photos: [], step: "processing" };
    case "PROCESSING":
      return { ...state, step: "processing", error: null };
    case "SET_RESULT":
      return { ...state, step: "results", result: action.result, diagnosticId: action.diagnosticId };
    case "SET_ERROR":
      return { ...state, step: "questions", error: action.error };
    case "RESTART":
      return { ...initialState, isRetake: true };
    default:
      return state;
  }
}

// --- Page component ---

export default function Diagnostic() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user, firebaseUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(["diagnostic", "common"]);
  const { translatedQuestions, translatedBridges } = useTranslatedQuestions();

  // Restore saved progress on mount
  useEffect(() => {
    const saved = loadProgress();
    if (saved) {
      dispatch({ type: "RESTORE", answers: saved.answers, questionIndex: saved.questionIndex });
    }
  }, []);

  // Check for existing completed diagnostic on mount
  useEffect(() => {
    if (!user) return;
    // Skip if user explicitly restarted, has answers in progress, or is past the questions step
    if (state.isRetake) return;
    if (state.step !== "questions" || Object.keys(state.answers).length > 0) return;

    async function checkExistingDiagnostic() {
      try {
        const q = query(
          collection(db, "diagnostics"),
          where("userId", "==", user!.uid),
          where("status", "==", "completed"),
          orderBy("createdAt", "desc"),
          limit(1),
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const existingDoc = snap.docs[0]!;
          const data = existingDoc.data();
          const result: DiagResult = {
            hydrationNeed: data.result.hydrationNeed,
            nutritionNeed: data.result.nutritionNeed,
            reconstructionNeed: data.result.reconstructionNeed,
            dominantNeed: data.result.dominantNeed,
          };
          dispatch({ type: "SET_RESULT", result, diagnosticId: existingDoc.id });
        }
      } catch {
        // Silently fail - user can still take a new diagnostic
      }
    }

    checkExistingDiagnostic();
  }, [user, state.step, state.answers, state.isRetake]);

  // Auto-save answers on change
  useEffect(() => {
    if (state.step === "questions" && Object.keys(state.answers).length > 0) {
      saveProgress(state.answers, state.questionIndex);
    }
  }, [state.answers, state.questionIndex, state.step]);

  // Compute visible questions using adaptive engine
  const visibleQuestionIds = useMemo(
    () => getAdaptiveQuestions(state.answers),
    [state.answers],
  );

  const questionMap = useMemo(() => new Map(translatedQuestions.map((q) => [q.id, q])), [translatedQuestions]);

  const visibleQuestions = useMemo(
    () => visibleQuestionIds.map((id) => questionMap.get(id)!).filter(Boolean),
    [visibleQuestionIds, questionMap],
  );

  const currentQuestion = visibleQuestions[state.questionIndex] ?? null;
  const isLastQuestion = state.questionIndex >= visibleQuestions.length - 1;
  const currentAnswer = currentQuestion ? state.answers[currentQuestion.id] : undefined;

  // Check if current question has a valid answer
  const hasValidAnswer = useCallback(() => {
    if (!currentQuestion) return false;
    if (!currentAnswer) return false;
    if (currentQuestion.tipo === "multiple_choice") {
      const arr = currentAnswer as string[];
      const min = currentQuestion.min_selecao ?? 1;
      return arr.length >= min;
    }
    return true;
  }, [currentQuestion, currentAnswer]);

  // Handle next button
  function handleNext() {
    if (isLastQuestion) {
      dispatch({ type: "GO_TO_PHOTO" });
    } else {
      dispatch({ type: "NEXT_QUESTION" });
    }
  }

  // Process diagnostic: calculate scores, optionally analyze photos, save to Firestore
  async function processDiagnostic(photos: File[]) {
    if (!user || !firebaseUser) return;

    try {
      // 1. Calculate questionnaire scores
      const raw = accumulateScores(state.answers);
      let result = normalizeScores(raw);

      // 2. Upload photos + get AI analysis if provided
      let photoUrls: string[] = [];
      let photoAnalysis: Record<string, unknown> | null = null;

      if (photos.length > 0) {
        // Upload to Firebase Storage
        const timestamp = Date.now();
        const uploadPromises = photos.map(async (file, i) => {
          const path = `users/${user.uid}/diagnostics/${timestamp}/photo_${i}.jpg`;
          const storageRef = ref(storage, path);
          await uploadBytes(storageRef, file);
          return getDownloadURL(storageRef);
        });
        photoUrls = await Promise.all(uploadPromises);

        // Call Gemini analysis
        try {
          const idToken = await firebaseUser.getIdToken();
          const aiResult = await analyzeHair(
            {
              userId: user.uid,
              photoUrls,
              context: {
                washingFrequency: mapWashingFrequency(state.answers["Q04"] as string),
                chemicalTreatments: hasChemicalTreatment(state.answers["Q02"] as string),
              },
            },
            idToken,
          );

          photoAnalysis = aiResult as unknown as Record<string, unknown>;

          // Combine questionnaire (70%) + AI (30%)
          const aiNeeds = mapAiResultToNeeds(aiResult);
          result = combineWithPhotoAnalysis(result, aiNeeds);
        } catch {
          // Photo analysis failed -- use questionnaire-only result
          console.warn("Photo analysis failed, using questionnaire-only result");
        }
      }

      // 3. Validate
      if (!validateResult(result)) {
        // Re-normalize if validation fails (safety net)
        result = normalizeScores(raw);
      }

      // 4. Save to Firestore
      const diagnosticId = `diag_${user.uid}_${Date.now()}`;
      await setDoc(doc(db, "diagnostics", diagnosticId), {
        userId: user.uid,
        level: "adaptive",
        answers: state.answers,
        scores: raw,
        result: {
          hydrationNeed: result.hydrationNeed,
          nutritionNeed: result.nutritionNeed,
          reconstructionNeed: result.reconstructionNeed,
          dominantNeed: result.dominantNeed,
        },
        hairType: mapToHairType(result),
        porosity: mapToPorosity(state.answers),
        photoUrls,
        photoAnalysis,
        isFallback: false,
        status: "completed",
        createdAt: serverTimestamp(),
        analyzedAt: serverTimestamp(),
      });

      // Clear auto-save on success
      clearProgress();

      dispatch({ type: "SET_RESULT", result, diagnosticId });
    } catch (err) {
      console.error("Diagnostic processing failed:", err);
      dispatch({
        type: "SET_ERROR",
        error: t("diagnostic:error.processing"),
      });
    }
  }

  // Navigate to schedule generation
  function handleGenerateSchedule() {
    navigate("/calendrier", { state: { diagnosticId: state.diagnosticId } });
  }

  // --- Render ---

  if (state.step === "photo") {
    return (
      <PhotoUpload
        onSubmit={(files) => {
          dispatch({ type: "SUBMIT_PHOTOS", files });
          processDiagnostic(files);
        }}
        onSkip={() => {
          dispatch({ type: "SKIP_PHOTO" });
          processDiagnostic([]);
        }}
      />
    );
  }

  if (state.step === "processing") {
    return (
      <div className="flex flex-col items-center justify-center px-4 pb-20 pt-16 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-gold-500" />
        <p className="mt-4 text-body text-gray-600">{t("diagnostic:processing.title")}</p>
        <p className="mt-1 text-caption text-gray-400">
          {t("diagnostic:processing.subtitle")}
        </p>
      </div>
    );
  }

  if (state.step === "results" && state.result) {
    return (
      <DiagnosticResultView
        result={state.result}
        onGenerateSchedule={handleGenerateSchedule}
        onRetake={() => {
          clearProgress();
          dispatch({ type: "RESTART" });
        }}
      />
    );
  }

  // --- Questions step ---
  if (!currentQuestion) {
    // All questions answered, go to photo step
    dispatch({ type: "GO_TO_PHOTO" });
    return null;
  }

  return (
    <div className="px-4 pb-20 pt-8">
      <ProgressBar
        current={state.questionIndex + 1}
        total={visibleQuestions.length}
      />

      {state.error && (
        <div className="mb-4 rounded-md bg-error/10 px-4 py-3 text-body-sm text-error">
          {state.error}
        </div>
      )}

      {/* Contextual bridge message */}
      {translatedBridges[currentQuestion.id] && (
        <p className="mb-3 text-body-sm italic text-gold-600">
          {translatedBridges[currentQuestion.id]}
        </p>
      )}

      <QuestionCard
        question={currentQuestion}
        answer={currentAnswer}
        onAnswer={(qId, val) => dispatch({ type: "ANSWER", questionId: qId, value: val })}
      />

      {/* Navigation */}
      <div className="mt-6 flex gap-3">
        {state.questionIndex > 0 && (
          <Button
            variant="secondary"
            className="gap-1"
            onClick={() => dispatch({ type: "PREV_QUESTION" })}
          >
            <ArrowLeft className="h-4 w-4" />
            {t("common:buttons.back")}
          </Button>
        )}

        <div className="flex-1" />

        {!currentQuestion.obrigatoria && !hasValidAnswer() && (
          <Button
            variant="ghost"
            className="gap-1 text-gray-500"
            onClick={() => {
              if (isLastQuestion) {
                dispatch({ type: "GO_TO_PHOTO" });
              } else {
                dispatch({ type: "SKIP_OPTIONAL" });
              }
            }}
          >
            {t("common:buttons.skip")}
            <SkipForward className="h-4 w-4" />
          </Button>
        )}

        <Button
          variant="primary"
          className="gap-1"
          disabled={!hasValidAnswer()}
          onClick={handleNext}
        >
          {isLastQuestion ? t("common:buttons.finish") : t("common:buttons.next")}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// --- Helper functions ---

function mapWashingFrequency(answer?: string): "daily" | "every_2_days" | "every_3_days" | "weekly" | undefined {
  if (!answer) return undefined;
  switch (answer) {
    case "1x": return "weekly";
    case "2x": return "every_3_days";
    case "3x": return "every_2_days";
    case "more_than_3x_week": return "daily";
    default: return undefined;
  }
}

function hasChemicalTreatment(answer?: string): boolean {
  if (!answer) return false;
  return ["coloring_lt_3_months", "coloring_gte_3_months", "bleach", "chemical_straightening"].includes(answer);
}

function mapAiResultToNeeds(aiResult: { hairType: string; porosity: string }): DiagResult {
  // Map AI analysis output to H/N/R percentages for combination
  const hairTypeMap: Record<string, { H: number; N: number; R: number }> = {
    dry: { H: 50, N: 30, R: 20 },
    oily: { H: 20, N: 50, R: 30 },
    normal: { H: 33, N: 33, R: 34 },
    mixed: { H: 35, N: 35, R: 30 },
    damaged: { H: 25, N: 25, R: 50 },
  };

  const defaultBase = { H: 33, N: 33, R: 34 };
  const base = hairTypeMap[aiResult.hairType] ?? defaultBase;

  // Porosity modifiers
  let n = base.N;
  let r = base.R;
  const h = base.H;
  if (aiResult.porosity === "high") { n += 5; r += 5; }
  if (aiResult.porosity === "low") { n += 10; }

  const total = h + n + r;
  return {
    hydrationNeed: Math.round((h / total) * 100),
    nutritionNeed: Math.round((n / total) * 100),
    reconstructionNeed: Math.round((r / total) * 100),
    dominantNeed: h >= n && h >= r ? "H" : n >= r ? "N" : "R",
  };
}
