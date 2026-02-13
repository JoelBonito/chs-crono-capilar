import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";

export default function ProfileSetup() {
  const { firebaseUser } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [acceptCGU, setAcceptCGU] = useState(false);
  const [optInSMS, setOptInSMS] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!firebaseUser) return;
    if (!acceptCGU) {
      setError("Vous devez accepter les CGU pour continuer.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await updateDoc(doc(db, "users", firebaseUser.uid), {
        phoneNumber: phone,
        optInSMS,
        updatedAt: serverTimestamp(),
      });
      navigate("/dashboard");
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-h2 text-gray-900">Compléter votre profil</h1>
        <p className="mt-2 text-body-sm text-gray-600">
          Quelques informations pour personnaliser votre expérience
        </p>

        {error && (
          <div className="mt-4 rounded-md bg-error/10 px-4 py-3 text-body-sm text-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="phone" className="text-caption font-medium text-gray-700">
              Numéro de téléphone (optionnel)
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-sm border border-gray-300 px-3 py-3 text-body focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          <div className="space-y-3 rounded-md border border-gray-200 p-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={acceptCGU}
                onChange={(e) => setAcceptCGU(e.target.checked)}
                className="mt-0.5 h-5 w-5 rounded border-gray-300 text-gold-500 focus:ring-gold-500"
              />
              <span className="text-body-sm text-gray-700">
                J&apos;accepte les{" "}
                <a
                  href="/cgu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-700 underline hover:text-gold-800"
                >
                  Conditions Générales d&apos;Utilisation
                </a>{" "}
                et la{" "}
                <a
                  href="/politique-de-confidentialite"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-700 underline hover:text-gold-800"
                >
                  Politique de Confidentialité
                </a>
                . *
              </span>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={optInSMS}
                onChange={(e) => setOptInSMS(e.target.checked)}
                className="mt-0.5 h-5 w-5 rounded border-gray-300 text-gold-500 focus:ring-gold-500"
              />
              <span className="text-body-sm text-gray-700">
                J&apos;accepte de recevoir des rappels par SMS pour mes soins capillaires.
              </span>
            </label>
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={loading || !acceptCGU}>
            {loading ? "Enregistrement..." : "Commencer mon diagnostic"}
          </Button>
        </form>
      </div>
    </div>
  );
}
