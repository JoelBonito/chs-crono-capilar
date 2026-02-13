import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-24">
      <Link to="/" className="inline-flex items-center gap-2 text-body-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Link>

      <h1 className="mt-6 font-serif text-h2 text-gray-900">
        Conditions Générales d'Utilisation (CGU)
      </h1>

      <p className="mt-4 text-body-sm text-gray-500">
        Dernière mise à jour : 13 février 2026
      </p>

      <div className="mt-8 space-y-6 text-body text-gray-700">
        <section>
          <h2 className="font-serif text-h4 text-gray-900">1. Présentation du service</h2>
          <p className="mt-2">
            CronoCapilar est une application web développée et éditée par{" "}
            <strong>H.A.M LUXURY HAIR COSMETICS</strong> (ci-après « CHS » ou « nous »), société par actions simplifiée au capital de 1.000,00 €, immatriculée au RCS de Marseille sous le numéro SIREN 884 206 707.
          </p>
          <p className="mt-2">
            L'application propose un service de diagnostic capillaire par intelligence artificielle et la création d'un chronogramme personnalisé (alternance Hydratation/Nutrition/Reconstruction) pour entretenir et améliorer la santé capillaire.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-h4 text-gray-900">2. Acceptation des CGU</h2>
          <p className="mt-2">
            L'utilisation de l'application CronoCapilar implique l'acceptation pleine et entière des présentes Conditions Générales d'Utilisation (CGU).
          </p>
          <p className="mt-2">
            En créant un compte, vous reconnaissez avoir pris connaissance de ces CGU et les accepter sans réserve.
          </p>
          <p className="mt-2">
            Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser l'application.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-h4 text-gray-900">3. Accès au service</h2>

          <h3 className="mt-4 font-medium text-gray-900">3.1. Conditions d'accès</h3>
          <p className="mt-2">
            L'application est accessible gratuitement à toute personne disposant d'un accès à Internet.
          </p>
          <p className="mt-2">
            Les frais d'accès et d'utilisation du réseau de télécommunication sont à la charge de l'utilisateur selon les modalités fixées par son opérateur.
          </p>

          <h3 className="mt-4 font-medium text-gray-900">3.2. Création de compte</h3>
          <p className="mt-2">
            Pour utiliser les fonctionnalités de CronoCapilar, vous devez créer un compte en fournissant :
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Votre prénom et nom</li>
            <li>Une adresse e-mail valide</li>
            <li>Un mot de passe sécurisé</li>
            <li>Optionnellement, un numéro de téléphone (requis pour les rappels SMS)</li>
          </ul>
          <p className="mt-2">
            Vous vous engagez à fournir des informations exactes et à jour. Vous êtes responsable de la confidentialité de vos identifiants de connexion.
          </p>

          <h3 className="mt-4 font-medium text-gray-900">3.3. Disponibilité</h3>
          <p className="mt-2">
            Nous nous efforçons de maintenir l'application accessible 24h/24 et 7j/7, mais ne pouvons garantir une disponibilité absolue en raison de contraintes techniques, de maintenance ou de cas de force majeure.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-h4 text-gray-900">4. Description des fonctionnalités</h2>

          <h3 className="mt-4 font-medium text-gray-900">4.1. Diagnostic capillaire</h3>
          <p className="mt-2">
            CronoCapilar utilise l'intelligence artificielle (Gemini AI de Google) pour analyser vos réponses au questionnaire et, optionnellement, vos photos capillaires afin de déterminer votre profil capillaire.
          </p>
          <p className="mt-2 rounded-sm border border-gold-200 bg-gold-50 p-3 text-body-sm">
            <strong>Avertissement :</strong> Les recommandations fournies sont à titre informatif et ne constituent pas un avis médical. En cas de problème capillaire sérieux (chute importante, dermatite, etc.), consultez un professionnel de santé (dermatologue, trichologue).
          </p>

          <h3 className="mt-4 font-medium text-gray-900">4.2. Chronogramme personnalisé</h3>
          <p className="mt-2">
            Sur la base du diagnostic, l'application génère un chronogramme capillaire sur 4 semaines, indiquant les jours de :
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li><strong>Hydratation (H)</strong> : soins pour retenir l'eau dans les cheveux</li>
            <li><strong>Nutrition (N)</strong> : soins pour nourrir la fibre capillaire</li>
            <li><strong>Reconstruction (R)</strong> : soins pour réparer les cheveux endommagés</li>
          </ul>

          <h3 className="mt-4 font-medium text-gray-900">4.3. Rappels SMS (optionnel)</h3>
          <p className="mt-2">
            Si vous activez les rappels SMS, vous recevrez des notifications pour :
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Vos séances de soins prévues</li>
            <li>Les alertes de renouvellement de produits</li>
          </ul>
          <p className="mt-2">
            Vous pouvez désactiver ces rappels à tout moment dans vos paramètres.
          </p>

          <h3 className="mt-4 font-medium text-gray-900">4.4. Calendrier synchronisé</h3>
          <p className="mt-2">
            Vous pouvez exporter votre chronogramme au format .ics pour l'intégrer à votre calendrier personnel (Google Calendar, Apple Calendar, Outlook).
          </p>
        </section>

        <section>
          <h2 className="font-serif text-h4 text-gray-900">5. Obligations de l'utilisateur</h2>
          <p className="mt-2">En utilisant CronoCapilar, vous vous engagez à :</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Respecter les présentes CGU et la législation en vigueur.</li>
            <li>Fournir des informations exactes lors de votre inscription.</li>
            <li>Ne pas utiliser l'application à des fins frauduleuses ou illégales.</li>
            <li>Ne pas tenter de contourner les mesures de sécurité de l'application.</li>
            <li>Ne pas partager vos identifiants de connexion avec des tiers.</li>
            <li>Signaler toute utilisation non autorisée de votre compte à <a href="mailto:chs.achat@gmail.com" className="text-gold-700 hover:underline">chs.achat@gmail.com</a>.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-h4 text-gray-900">6. Responsabilité de CHS</h2>

          <h3 className="mt-4 font-medium text-gray-900">6.1. Contenu généré par IA</h3>
          <p className="mt-2">
            Les recommandations capillaires sont générées par une intelligence artificielle et sont fournies à titre indicatif. CHS ne peut garantir leur exactitude absolue ni être tenue responsable des résultats obtenus suite à leur application.
          </p>

          <h3 className="mt-4 font-medium text-gray-900">6.2. Limitation de responsabilité</h3>
          <p className="mt-2">
            CHS ne saurait être tenue responsable :
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Des dommages directs ou indirects résultant de l'utilisation de l'application.</li>
            <li>Des réactions allergiques ou problèmes capillaires liés à l'utilisation de produits tiers recommandés.</li>
            <li>De l'interruption temporaire du service pour maintenance ou mise à jour.</li>
            <li>De la perte de données en cas de problème technique, sauf faute lourde de notre part.</li>
          </ul>

          <h3 className="mt-4 font-medium text-gray-900">6.3. Sauvegardes</h3>
          <p className="mt-2">
            Bien que nous effectuions des sauvegardes régulières de vos données, nous vous recommandons d'exporter votre chronogramme (.ics) pour conserver une copie locale.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-h4 text-gray-900">7. Propriété intellectuelle</h2>
          <p className="mt-2">
            Tous les éléments de l'application CronoCapilar (design, code source, algorithmes, textes, logos, icônes) sont la propriété exclusive de H.A.M LUXURY HAIR COSMETICS, protégés par le droit d'auteur et les lois sur la propriété intellectuelle.
          </p>
          <p className="mt-2">
            Toute reproduction, distribution ou utilisation non autorisée est strictement interdite et constitue une contrefaçon passible de sanctions pénales.
          </p>
          <p className="mt-2">
            Les contenus que vous créez (photos capillaires uploadées, notes personnelles) restent votre propriété. En les téléchargeant sur l'application, vous nous accordez une licence limitée pour les traiter dans le cadre du service (analyse par IA, stockage).
          </p>
        </section>

        <section>
          <h2 className="font-serif text-h4 text-gray-900">8. Données personnelles</h2>
          <p className="mt-2">
            Le traitement de vos données personnelles est décrit en détail dans notre{" "}
            <Link to="/politique-de-confidentialite" className="text-gold-700 underline hover:text-gold-800">
              Politique de confidentialité
            </Link>, conforme au RGPD (Règlement Général sur la Protection des Données).
          </p>
          <p className="mt-2">
            Vous disposez d'un droit d'accès, de rectification, d'effacement (droit à l'oubli), de portabilité et d'opposition sur vos données.
          </p>
          <p className="mt-2">
            Pour exercer ces droits, contactez-nous à{" "}
            <a href="mailto:chs.achat@gmail.com" className="text-gold-700 hover:underline">
              chs.achat@gmail.com
            </a>.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-h4 text-gray-900">9. Modification du service</h2>
          <p className="mt-2">
            CHS se réserve le droit de modifier, suspendre ou interrompre tout ou partie de l'application à tout moment, sans préavis ni indemnité.
          </p>
          <p className="mt-2">
            En cas de modification substantielle affectant l'utilisation du service, vous serez informé(e) par e-mail ou notification dans l'application.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-h4 text-gray-900">10. Modification des CGU</h2>
          <p className="mt-2">
            Les présentes CGU peuvent être modifiées à tout moment. La version en vigueur est celle accessible sur l'application, avec indication de la date de dernière mise à jour.
          </p>
          <p className="mt-2">
            En continuant à utiliser l'application après modification des CGU, vous acceptez les nouvelles conditions.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-h4 text-gray-900">11. Suspension et résiliation</h2>

          <h3 className="mt-4 font-medium text-gray-900">11.1. Suspension par CHS</h3>
          <p className="mt-2">
            CHS se réserve le droit de suspendre ou supprimer votre compte en cas de :
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Violation des présentes CGU</li>
            <li>Utilisation frauduleuse ou abusive de l'application</li>
            <li>Comportement nuisible aux autres utilisateurs ou à CHS</li>
          </ul>

          <h3 className="mt-4 font-medium text-gray-900">11.2. Suppression par l'utilisateur</h3>
          <p className="mt-2">
            Vous pouvez supprimer votre compte à tout moment via Paramètres → Supprimer mon compte. Cette action est irréversible et entraîne la suppression définitive de toutes vos données conformément à l'Article 17 du RGPD.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-h4 text-gray-900">12. Droit applicable et juridiction</h2>
          <p className="mt-2">
            Les présentes CGU sont régies par le droit français.
          </p>
          <p className="mt-2">
            Tout litige relatif à l'interprétation ou à l'exécution des présentes sera soumis, à défaut d'accord amiable, aux tribunaux français compétents.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-h4 text-gray-900">13. Contact</h2>
          <p className="mt-2">
            Pour toute question concernant ces Conditions Générales d'Utilisation :
          </p>
          <div className="mt-3 rounded-sm border border-gray-200 bg-gray-50 p-4">
            <p className="font-medium">H.A.M LUXURY HAIR COSMETICS</p>
            <p>63 Avenue Claude Monet</p>
            <p>13014 Marseille, France</p>
            <p className="mt-2">
              <strong>E-mail :</strong>{" "}
              <a href="mailto:chs.achat@gmail.com" className="text-gold-700 hover:underline">
                chs.achat@gmail.com
              </a>
            </p>
            <p>
              <strong>Téléphone :</strong>{" "}
              <a href="tel:+33617767675" className="text-gold-700 hover:underline">
                +33 6 17 76 76 75
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
