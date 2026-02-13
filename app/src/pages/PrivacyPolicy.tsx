import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-24">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-body-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Link>

      <h1 className="mt-6 font-serif text-h2 text-gray-900">
        Politique de confidentialité
      </h1>

      <p className="mt-4 text-body-sm text-gray-500">
        Dernière mise à jour : 13 février 2026
      </p>

      <div className="mt-8 space-y-6 text-body text-gray-700">
        {/* 1. Responsable du traitement */}
        <section>
          <h2 className="font-serif text-h4 text-gray-900">
            1. Responsable du traitement des données
          </h2>
          <p className="mt-2">
            Le responsable du traitement des données personnelles collectées via
            l'application CronoCapilar est :
          </p>
          <div className="mt-3 rounded-sm border border-gray-200 bg-gray-50 p-4">
            <p className="font-medium">H.A.M LUXURY HAIR COSMETICS</p>
            <p>SAS au capital de 1.000,00 €</p>
            <p>SIREN : 884 206 707</p>
            <p>Siège social : 63 Avenue Claude Monet, 13014 Marseille, France</p>
            <p>N° TVA Intracommunautaire : FR30 884 206 707</p>
            <p>Représentant légal : Laurent HAMAMLIAN, Président</p>
            <p className="mt-2">
              <strong>Contact données personnelles :</strong>{" "}
              <a
                href="mailto:chs.achat@gmail.com"
                className="text-gold-700 hover:underline"
              >
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

        {/* 2. Base légale */}
        <section>
          <h2 className="font-serif text-h4 text-gray-900">2. Base légale du traitement</h2>
          <p className="mt-2">
            Le traitement de vos données personnelles repose sur les bases légales suivantes
            (Article 6 du RGPD) :
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              <strong>Exécution du contrat :</strong> création de votre compte, génération du
              chronogramme capillaire personnalisé.
            </li>
            <li>
              <strong>Consentement :</strong> envoi de rappels SMS (opt-in explicite lors de
              l'inscription).
            </li>
            <li>
              <strong>Intérêt légitime :</strong> amélioration de nos services et analyse
              statistique anonymisée.
            </li>
          </ul>
        </section>

        {/* 3. Données collectées */}
        <section>
          <h2 className="font-serif text-h4 text-gray-900">
            3. Données personnelles collectées
          </h2>
          <p className="mt-2">Nous collectons les catégories de données suivantes :</p>

          <h3 className="mt-4 font-medium text-gray-900">Données d'identification</h3>
          <ul className="mt-1 list-inside list-disc space-y-1">
            <li>Prénom et nom</li>
            <li>Adresse e-mail</li>
            <li>Numéro de téléphone (optionnel, requis pour SMS)</li>
          </ul>

          <h3 className="mt-4 font-medium text-gray-900">Données capillaires</h3>
          <ul className="mt-1 list-inside list-disc space-y-1">
            <li>Photos de vos cheveux (optionnel)</li>
            <li>Réponses au diagnostic capillaire (type de cheveux, état, historique)</li>
            <li>Chronogramme personnalisé généré (séquence H/N/R)</li>
            <li>Historique des soins appliqués</li>
          </ul>

          <h3 className="mt-4 font-medium text-gray-900">Données de connexion</h3>
          <ul className="mt-1 list-inside list-disc space-y-1">
            <li>Identifiant Firebase (UID)</li>
            <li>Date de création et dernière connexion</li>
            <li>Adresse IP (logs techniques uniquement)</li>
          </ul>
        </section>

        {/* 4. Finalités */}
        <section>
          <h2 className="font-serif text-h4 text-gray-900">4. Finalités du traitement</h2>
          <p className="mt-2">Vos données sont traitées pour les finalités suivantes :</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              <strong>Diagnostic capillaire :</strong> analyse de votre type de cheveux via
              intelligence artificielle (Gemini AI).
            </li>
            <li>
              <strong>Personnalisation du chronogramme :</strong> création d'un calendrier
              adapté (Hydratation/Nutrition/Reconstruction).
            </li>
            <li>
              <strong>Rappels SMS :</strong> envoi de notifications pour vos séances de soins
              et alertes de renouvellement de produits (uniquement si vous avez consenti).
            </li>
            <li>
              <strong>Gestion du compte :</strong> authentification, paramètres de
              l'utilisateur.
            </li>
            <li>
              <strong>Amélioration des services :</strong> statistiques anonymisées, détection
              d'erreurs techniques.
            </li>
          </ul>
        </section>

        {/* 5. Destinataires */}
        <section>
          <h2 className="font-serif text-h4 text-gray-900">5. Destinataires des données</h2>
          <p className="mt-2">
            Vos données personnelles peuvent être transmises aux sous-traitants suivants, tous
            soumis à des accords de traitement de données (DPA) conformes au RGPD :
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              <strong>Google Cloud Platform (Firebase) :</strong> hébergement de la base de
              données et stockage des photos (région europe-west1, Belgique).
            </li>
            <li>
              <strong>Google Vertex AI (Gemini) :</strong> analyse des photos capillaires (les
              images sont traitées temporairement et ne sont pas conservées par Google).
            </li>
            <li>
              <strong>Twilio :</strong> envoi de SMS (uniquement si vous avez activé les
              rappels).
            </li>
            <li>
              <strong>Bitly :</strong> raccourcissement des URLs dans les SMS (pas de données
              personnelles transmises).
            </li>
          </ul>
          <p className="mt-2">
            Aucune de vos données n'est vendue à des tiers ni utilisée à des fins publicitaires.
          </p>
        </section>

        {/* 6. Transferts internationaux */}
        <section>
          <h2 className="font-serif text-h4 text-gray-900">
            6. Transferts hors Union européenne
          </h2>
          <p className="mt-2">
            Toutes vos données sont hébergées dans l'Union européenne (région europe-west1,
            Belgique). Les prestataires américains (Google, Twilio) sont conformes aux clauses
            contractuelles types de la Commission européenne et au Data Privacy Framework
            UE-USA.
          </p>
        </section>

        {/* 7. Durée de conservation */}
        <section>
          <h2 className="font-serif text-h4 text-gray-900">7. Durée de conservation</h2>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              <strong>Données de compte :</strong> conservées jusqu'à suppression de votre
              compte ou 3 ans d'inactivité.
            </li>
            <li>
              <strong>Photos capillaires :</strong> conservées 24 mois maximum, supprimées
              automatiquement ensuite.
            </li>
            <li>
              <strong>Historique des soins :</strong> conservé jusqu'à suppression du compte.
            </li>
            <li>
              <strong>Logs techniques :</strong> conservés 6 mois maximum (sécurité et
              débogage).
            </li>
          </ul>
        </section>

        {/* 8. Vos droits */}
        <section>
          <h2 className="font-serif text-h4 text-gray-900">8. Vos droits (RGPD)</h2>
          <p className="mt-2">
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous
            disposez des droits suivants :
          </p>

          <div className="mt-3 space-y-3">
            <div>
              <h3 className="font-medium text-gray-900">
                Droit d'accès (Article 15 du RGPD)
              </h3>
              <p className="mt-1 text-body-sm">
                Vous pouvez demander une copie de toutes les données personnelles que nous
                détenons à votre sujet.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900">
                Droit de rectification (Article 16)
              </h3>
              <p className="mt-1 text-body-sm">
                Vous pouvez corriger vos informations directement dans l'application (menu
                Paramètres).
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900">
                Droit à l'effacement / Droit à l'oubli (Article 17)
              </h3>
              <p className="mt-1 text-body-sm">
                Vous pouvez supprimer définitivement votre compte et toutes vos données via
                Paramètres → Supprimer mon compte. Cette action est irréversible et conforme à
                l'Article 17 du RGPD.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900">
                Droit à la portabilité (Article 20)
              </h3>
              <p className="mt-1 text-body-sm">
                Vous pouvez demander l'export de vos données dans un format structuré et lisible
                (JSON).
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900">
                Droit d'opposition (Article 21)
              </h3>
              <p className="mt-1 text-body-sm">
                Vous pouvez vous opposer à tout moment à l'envoi de SMS marketing en désactivant
                l'option dans Paramètres.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900">
                Droit de limitation du traitement (Article 18)
              </h3>
              <p className="mt-1 text-body-sm">
                Vous pouvez demander la suspension temporaire du traitement de vos données.
              </p>
            </div>
          </div>

          <p className="mt-4 rounded-sm border border-gold-200 bg-gold-50 p-4">
            <strong>Pour exercer vos droits :</strong> Contactez-nous par e-mail à{" "}
            <a
              href="mailto:chs.achat@gmail.com"
              className="text-gold-700 underline hover:text-gold-800"
            >
              chs.achat@gmail.com
            </a>{" "}
            ou par téléphone au{" "}
            <a href="tel:+33617767675" className="text-gold-700 underline hover:text-gold-800">
              +33 6 17 76 76 75
            </a>
            . Nous répondrons dans un délai d'un mois maximum (Article 12 du RGPD).
          </p>
        </section>

        {/* 9. Droit de réclamation */}
        <section>
          <h2 className="font-serif text-h4 text-gray-900">
            9. Droit de réclamation auprès de la CNIL
          </h2>
          <p className="mt-2">
            Si vous estimez que vos droits ne sont pas respectés, vous avez le droit d'introduire
            une réclamation auprès de l'autorité de contrôle française :
          </p>
          <div className="mt-3 rounded-sm border border-gray-200 bg-gray-50 p-4">
            <p className="font-medium">
              Commission Nationale de l'Informatique et des Libertés (CNIL)
            </p>
            <p>3 Place de Fontenoy, TSA 80715</p>
            <p>75334 Paris Cedex 07, France</p>
            <p className="mt-1">
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-700 underline hover:text-gold-800"
              >
                www.cnil.fr
              </a>
            </p>
          </div>
        </section>

        {/* 10. Cookies */}
        <section>
          <h2 className="font-serif text-h4 text-gray-900">10. Cookies et traceurs</h2>
          <p className="mt-2">
            CronoCapilar n'utilise <strong>aucun cookie de tracking marketing</strong>. Seuls
            les cookies techniques strictement nécessaires au fonctionnement de l'application
            sont utilisés (session Firebase, authentification).
          </p>
        </section>

        {/* 11. Sécurité */}
        <section>
          <h2 className="font-serif text-h4 text-gray-900">11. Sécurité des données</h2>
          <p className="mt-2">
            Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos
            données :
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Chiffrement HTTPS (TLS 1.3) pour toutes les communications.</li>
            <li>
              Authentification sécurisée via Firebase Authentication (OAuth 2.0, bcrypt pour les
              mots de passe).
            </li>
            <li>Règles de sécurité Firestore (accès restreint aux données propriétaires).</li>
            <li>Sauvegardes automatiques quotidiennes.</li>
            <li>Logs d'accès et audits de sécurité réguliers.</li>
          </ul>
        </section>

        {/* 12. Modifications */}
        <section>
          <h2 className="font-serif text-h4 text-gray-900">
            12. Modifications de la politique de confidentialité
          </h2>
          <p className="mt-2">
            Nous nous réservons le droit de modifier cette politique. En cas de changement
            substantiel, vous serez informé(e) par e-mail ou notification dans l'application. La
            date de dernière mise à jour est indiquée en haut de ce document.
          </p>
        </section>

        {/* 13. Contact */}
        <section>
          <h2 className="font-serif text-h4 text-gray-900">13. Nous contacter</h2>
          <p className="mt-2">
            Pour toute question concernant cette politique de confidentialité ou l'exercice de
            vos droits :
          </p>
          <div className="mt-3 rounded-sm border border-gray-200 bg-gray-50 p-4">
            <p className="font-medium">H.A.M LUXURY HAIR COSMETICS</p>
            <p>Délégué à la Protection des Données (DPO)</p>
            <p className="mt-2">
              <strong>E-mail :</strong>{" "}
              <a
                href="mailto:chs.achat@gmail.com"
                className="text-gold-700 underline hover:text-gold-800"
              >
                chs.achat@gmail.com
              </a>
            </p>
            <p>
              <strong>Téléphone :</strong>{" "}
              <a
                href="tel:+33617767675"
                className="text-gold-700 underline hover:text-gold-800"
              >
                +33 6 17 76 76 75
              </a>
            </p>
            <p>
              <strong>Courrier :</strong> 63 Avenue Claude Monet, 13014 Marseille, France
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
