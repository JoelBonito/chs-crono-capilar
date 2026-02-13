import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ScanFace, Calendar, Bell } from "lucide-react";
import Logo from "@/components/Logo";

export default function LandingPage() {
  const { t } = useTranslation("landing");

  const features = [
    {
      icon: ScanFace,
      title: t("features.diagnostic.title"),
      description: t("features.diagnostic.description"),
    },
    {
      icon: Calendar,
      title: t("features.schedule.title"),
      description: t("features.schedule.description"),
    },
    {
      icon: Bell,
      title: t("features.alerts.title"),
      description: t("features.alerts.description"),
    },
  ];

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <Logo size="xl" className="mb-8" />
        <h1 className="font-serif text-hero text-gray-900">
          {t("hero.title1")}
          <br />
          <span className="text-gold-700">{t("hero.title2")}</span>
        </h1>
        <p className="mt-4 max-w-md text-body text-gray-600">
          {t("hero.subtitle")}
        </p>
        <div className="mt-8 flex gap-4">
          <Link to="/signup">
            <Button variant="primary">{t("hero.cta")}</Button>
          </Link>
          <Link to="/login">
            <Button variant="ghost">{t("hero.login")}</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 px-4 py-12">
        <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/10">
                <f.icon className="h-6 w-6 text-gold-500" />
              </div>
              <h3 className="mt-4 font-sans text-h4 text-gray-900">{f.title}</h3>
              <p className="mt-2 text-body-sm text-gray-600">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <Logo size="sm" />
            <p className="text-caption text-gray-500">{t("footer.copyright")}</p>
            <nav className="flex gap-4 text-caption text-gray-500">
              <Link to="/mentions-legales" className="hover:text-gray-900">
                {t("footer.legal")}
              </Link>
              <Link to="/politique-de-confidentialite" className="hover:text-gray-900">
                {t("footer.privacy")}
              </Link>
              <Link to="/cgu" className="hover:text-gray-900">
                {t("footer.cgu")}
              </Link>
            </nav>
          </div>
          <div className="flex flex-col items-center gap-2 text-caption text-gray-400 sm:flex-row sm:justify-center sm:gap-4">
            <a href="mailto:chs.achat@gmail.com" className="hover:text-gray-600">
              chs.achat@gmail.com
            </a>
            <span className="hidden sm:inline">•</span>
            <a href="tel:+33617767675" className="hover:text-gray-600">
              +33 6 17 76 76 75
            </a>
            <span className="hidden sm:inline">•</span>
            <span>cronocapilar.inoveai.app.br</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
