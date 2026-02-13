import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { FirebaseError } from "firebase/app";
import Logo from "@/components/Logo";

export default function Signup() {
  const { t } = useTranslation("auth");
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signUpWithEmail(email, password, firstName, lastName);
      navigate("/profile-setup");
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(t(`errors.${err.code}`, { defaultValue: t("errors.generic") }));
      } else {
        setError(t("errors.generic"));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(t(`errors.${err.code}`, { defaultValue: t("errors.generic") }));
      } else {
        setError(t("errors.generic"));
      }
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Logo size="lg" className="mx-auto mb-6" />
        <h1 className="font-serif text-h2 text-gray-900">{t("signup.title")}</h1>
        <p className="mt-2 text-body-sm text-gray-600">
          {t("signup.subtitle")}
        </p>

        {error && (
          <div className="mt-4 rounded-md bg-error/10 px-4 py-3 text-body-sm text-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="text-caption font-medium text-gray-700">
                {t("signup.firstName")}
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 w-full rounded-sm border border-gray-300 px-3 py-3 text-body focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="text-caption font-medium text-gray-700">
                {t("signup.lastName")}
              </label>
              <input
                id="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 w-full rounded-sm border border-gray-300 px-3 py-3 text-body focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="text-caption font-medium text-gray-700">
              {t("signup.email")}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-sm border border-gray-300 px-3 py-3 text-body focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
              placeholder={t("signup.emailPlaceholder")}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-caption font-medium text-gray-700">
              {t("signup.password")}
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-sm border border-gray-300 px-3 py-3 text-body focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
              placeholder={t("signup.passwordPlaceholder")}
            />
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? t("signup.submitting") : t("signup.submit")}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-caption text-gray-400">{t("common:buttons.or")}</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <Button variant="google" className="w-full gap-3" onClick={handleGoogle}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.94.46 3.77 1.18 5.43l3.66-3.34z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {t("signup.googleButton")}
        </Button>

        <p className="mt-6 text-center text-body-sm text-gray-600">
          {t("signup.hasAccount")}{" "}
          <Link to="/login" className="font-medium text-gold-700 hover:text-gold-800">
            {t("signup.signIn")}
          </Link>
        </p>

        <p className="mt-4 text-center text-caption text-gray-400">
          {t("signup.legalNotice")}{" "}
          <Link to="/cgu" className="underline hover:text-gray-600">
            {t("signup.cgu")}
          </Link>{" "}
          {t("signup.and")}{" "}
          <Link to="/politique-de-confidentialite" className="underline hover:text-gray-600">
            {t("signup.privacy")}
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
