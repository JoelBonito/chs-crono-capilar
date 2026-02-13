import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import {
  Phone,
  Bell,
  FileText,
  Shield,
  Scale,
  Trash2,
  LogOut,
  ChevronRight,
  Loader2,
  Check,
  X,
  Pencil,
} from "lucide-react";

// -- Constants --

const APP_VERSION = "CronoCapilar v1.0";
const APP_AUTHOR = "Fait avec soin par CHS Paris";
const APP_COPYRIGHT = "2026 Cosmetic Hair Shop";

const LEGAL_LINKS = [
  { to: "/cgu", label: "Conditions Generales d'Utilisation", icon: FileText },
  { to: "/politique-de-confidentialite", label: "Politique de Confidentialite", icon: Shield },
  { to: "/mentions-legales", label: "Mentions Legales", icon: Scale },
] as const;

// -- Helpers --

function getInitials(firstName: string, lastName: string): string {
  const f = firstName.charAt(0).toUpperCase();
  const l = lastName.charAt(0).toUpperCase();
  return f + l || "?";
}

function buildFunctionsBaseUrl(): string {
  if (import.meta.env.VITE_USE_EMULATORS === "true") {
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "demo-project";
    return `http://localhost:5001/${projectId}/europe-west1`;
  }
  return `https://europe-west1-${import.meta.env.VITE_FIREBASE_PROJECT_ID}.cloudfunctions.net`;
}

// -- Component --

export default function Settings() {
  const { user, firebaseUser, signOut } = useAuth();
  const navigate = useNavigate();

  // Edit mode state
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Feedback state
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form fields (synced from user profile)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [optInSMS, setOptInSMS] = useState(false);

  // Sync form state when user profile loads/changes
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setPhone(user.phoneNumber);
      setOptInSMS(user.optInSMS);
    }
  }, [user]);

  // -- Handlers --

  const handleStartEditing = useCallback(() => {
    setEditing(true);
    setError(null);
    setSuccess(null);
  }, []);

  const handleCancelEditing = useCallback(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setPhone(user.phoneNumber);
      setOptInSMS(user.optInSMS);
    }
    setEditing(false);
    setError(null);
  }, [user]);

  const handleSave = useCallback(async () => {
    if (!firebaseUser) return;

    setSaving(true);
    setError(null);
    try {
      await updateDoc(doc(db, "users", firebaseUser.uid), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phone.trim(),
        optInSMS,
        updatedAt: serverTimestamp(),
      });
      setSuccess("Profil mis a jour avec succes.");
      setEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("Impossible de mettre a jour le profil.");
    } finally {
      setSaving(false);
    }
  }, [firebaseUser, firstName, lastName, phone, optInSMS]);

  const handleDeleteAccount = useCallback(async () => {
    if (!firebaseUser) return;

    setDeleting(true);
    setError(null);
    try {
      const idToken = await firebaseUser.getIdToken();
      const baseUrl = buildFunctionsBaseUrl();

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      };

      const response = await fetch(`${baseUrl}/deleteAccount`, {
        method: "POST",
        headers,
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      await signOut();
      navigate("/");
    } catch {
      setError("Impossible de supprimer le compte. Veuillez reessayer.");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }, [firebaseUser, signOut, navigate]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    navigate("/");
  }, [signOut, navigate]);

  // -- Render --

  return (
    <div className="px-4 pb-24 pt-8">
      {/* Page header */}
      <h1 className="font-serif text-h2 text-gray-900">Parametres</h1>

      {/* Feedback banners */}
      {error && (
        <div className="mt-4 rounded-sm border border-error/20 bg-error/5 px-4 py-3 text-body-sm text-error">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 rounded-sm border border-success/20 bg-success/5 px-4 py-3 text-body-sm text-success">
          {success}
        </div>
      )}

      {/* ---- PROFILE SECTION ---- */}
      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-caption font-medium uppercase tracking-wider text-gray-400">
            Profil
          </h2>
          {!editing && (
            <button
              type="button"
              onClick={handleStartEditing}
              className="flex items-center gap-1 text-caption text-gold-700 transition-colors duration-fast hover:text-gold-800"
            >
              <Pencil className="h-3.5 w-3.5" />
              Modifier
            </button>
          )}
        </div>

        <div className="mt-2 rounded-sm border border-gray-200">
          {/* Avatar + identity row */}
          <div className="flex items-center gap-4 px-4 py-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold-500/10">
              <span className="font-sans text-h4 font-semibold text-gold-700">
                {getInitials(
                  editing ? firstName : (user?.firstName ?? ""),
                  editing ? lastName : (user?.lastName ?? ""),
                )}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              {editing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Prenom"
                    aria-label="Prenom"
                    className="w-full rounded-sm border border-gray-300 px-3 py-2 text-body focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                  />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Nom"
                    aria-label="Nom de famille"
                    className="w-full rounded-sm border border-gray-300 px-3 py-2 text-body focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                  />
                </div>
              ) : (
                <>
                  <p className="truncate font-sans text-h4 text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="truncate text-body-sm text-gray-500">{user?.email}</p>
                </>
              )}
            </div>
          </div>

          {/* Phone row */}
          <div className="border-t border-gray-100 px-4 py-3">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 shrink-0 text-gray-400" />
              {editing ? (
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  aria-label="Numero de telephone"
                  className="w-full rounded-sm border border-gray-300 px-3 py-2 text-body focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                />
              ) : (
                <span className="text-body text-gray-900">
                  {user?.phoneNumber || "Non renseigne"}
                </span>
              )}
            </div>
          </div>

          {/* SMS opt-in row */}
          <div className="border-t border-gray-100 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 shrink-0 text-gray-400" />
                <span className="text-body text-gray-900">Rappels SMS</span>
              </div>
              {editing ? (
                <button
                  type="button"
                  role="switch"
                  aria-checked={optInSMS}
                  aria-label="Activer les rappels SMS"
                  onClick={() => setOptInSMS(!optInSMS)}
                  className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-fast ${
                    optInSMS ? "bg-gold-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-fast ${
                      optInSMS ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              ) : (
                <span className="text-body-sm text-gray-500">
                  {user?.optInSMS ? "Active" : "Desactive"}
                </span>
              )}
            </div>
          </div>

          {/* Save / Cancel row (visible only when editing) */}
          {editing && (
            <div className="flex gap-3 border-t border-gray-100 px-4 py-3">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 gap-1.5"
                onClick={handleCancelEditing}
                disabled={saving}
              >
                <X className="h-4 w-4" />
                Annuler
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex-1 gap-1.5"
                onClick={handleSave}
                disabled={saving || (!firstName.trim() && !lastName.trim())}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                {saving ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ---- LEGAL SECTION ---- */}
      <section className="mt-8">
        <h2 className="text-caption font-medium uppercase tracking-wider text-gray-400">
          Informations legales
        </h2>
        <div className="mt-2 divide-y divide-gray-100 rounded-sm border border-gray-200">
          {LEGAL_LINKS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center justify-between px-4 py-3 transition-colors duration-fast hover:bg-gray-50 active:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-gray-400" />
                <span className="text-body text-gray-900">{label}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </Link>
          ))}
        </div>
      </section>

      {/* ---- ACCOUNT ACTIONS SECTION ---- */}
      <section className="mt-8">
        <h2 className="text-caption font-medium uppercase tracking-wider text-gray-400">
          Compte
        </h2>
        <div className="mt-2 divide-y divide-gray-100 rounded-sm border border-gray-200">
          {/* Sign out */}
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-fast hover:bg-gray-50 active:bg-gray-100"
          >
            <LogOut className="h-5 w-5 text-gray-400" />
            <span className="text-body text-gray-900">Se deconnecter</span>
          </button>

          {/* Delete account */}
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-fast hover:bg-error/5 active:bg-error/10"
          >
            <Trash2 className="h-5 w-5 text-error" />
            <span className="text-body text-error">Supprimer mon compte</span>
          </button>
        </div>
      </section>

      {/* ---- APP INFO FOOTER ---- */}
      <footer className="mt-10 space-y-3 text-center">
        <Logo size="sm" className="mx-auto" />
        <p className="text-caption text-gray-400">{APP_VERSION}</p>
        <p className="text-caption text-gray-400">{APP_AUTHOR}</p>
        <p className="text-caption text-gray-300">&copy; {APP_COPYRIGHT}</p>
      </footer>

      {/* ---- DELETE CONFIRMATION DIALOG ---- */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-modal flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="w-full max-w-sm rounded-sm border border-gray-200 bg-white p-6 shadow-lg">
            <h3
              id="delete-dialog-title"
              className="font-serif text-h4 text-gray-900"
            >
              Supprimer votre compte
            </h3>
            <p className="mt-2 text-body-sm text-gray-600">
              Cette action est irreversible. Toutes vos donnees seront supprimees conformement au RGPD (Article 17).
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Annuler
              </Button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-error px-4 py-2.5 text-body-sm font-medium text-white transition-colors duration-fast hover:bg-red-800 disabled:opacity-50"
              >
                {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                {deleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
