import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScanFace, Calendar, Bell } from "lucide-react";
import Logo from "@/components/Logo";

const features = [
  {
    icon: ScanFace,
    title: "Diagnostic IA",
    description: "Analysez votre type de cheveux grâce à notre intelligence artificielle.",
  },
  {
    icon: Calendar,
    title: "Chronogramme personnalisé",
    description: "Un calendrier H/N/R adapté à vos besoins capillaires.",
  },
  {
    icon: Bell,
    title: "Alertes intelligentes",
    description: "Rappels SMS pour ne jamais oublier vos soins.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <Logo size="xl" className="mb-8" />
        <h1 className="font-serif text-hero text-gray-900">
          Votre routine capillaire,
          <br />
          <span className="text-gold-700">sublimée par l&apos;IA</span>
        </h1>
        <p className="mt-4 max-w-md text-body text-gray-600">
          CronoCapilar crée un chronogramme personnalisé pour des cheveux sains et éclatants.
        </p>
        <div className="mt-8 flex gap-4">
          <Link to="/signup">
            <Button variant="primary">Commencer</Button>
          </Link>
          <Link to="/login">
            <Button variant="ghost">Se connecter</Button>
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
            <p className="text-caption text-gray-500">&copy; 2026 CronoCapilar - H.A.M LUXURY HAIR COSMETICS</p>
            <nav className="flex gap-4 text-caption text-gray-500">
              <Link to="/mentions-legales" className="hover:text-gray-900">
                Mentions légales
              </Link>
              <Link to="/politique-de-confidentialite" className="hover:text-gray-900">
                Confidentialité
              </Link>
              <Link to="/cgu" className="hover:text-gray-900">
                CGU
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
