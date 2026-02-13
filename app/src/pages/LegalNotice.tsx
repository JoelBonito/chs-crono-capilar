import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function LegalNotice() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-24">
      <Link to="/" className="inline-flex items-center gap-2 text-body-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Link>

      <h1 className="mt-6 font-serif text-h2 text-gray-900">Mentions légales</h1>

      <p className="mt-4 text-body-sm text-gray-500">
        Dernière mise à jour : 13 février 2026
      </p>

      <div className="mt-8 space-y-6 text-body text-gray-700">
        <section>
          <h2 className="font-serif text-h4 text-gray-900">1. Éditeur du site</h2>
          <p className="mt-2">
            L'application CronoCapilar est éditée par :
          </p>
          <div className="mt-3 rounded-sm border border-gray-200 bg-gray-50 p-4">
            <p className="font-medium">H.A.M LUXURY HAIR COSMETICS</p>
            <p>SAS (Société par Actions Simplifiée) au capital de 1.000,00 €</p>
            <p className="mt-2">
              <strong>SIREN :</strong> 884 206 707
            </p>
            <p>
              <strong>SIRET :</strong> 884 206 707 00033
            </p>
            <p>
              <strong>Code NAF/APE :</strong> 46.45Z - Commerce de gros (commerce interentreprises) de parfumerie et de produits de beauté
            </p>
            <p>
              <strong>N° TVA Intracommunautaire :</strong> FR30 884 206 707
            </p>
            <p className="mt-2">
              <strong>Siège social :</strong><br />
              63 Avenue Claude Monet<br />
              13014 Marseille, France
            </p>
            <p className="mt-2">
              <strong>Représentant légal :</strong> Laurent HAMAMLIAN, Président
            </p>
            <p className="mt-2">
              <strong>Téléphone :</strong>{" "}
              <a href="tel:+33617767675" className="text-gold-700 hover:underline">
                +33 6 17 76 76 75
              </a>
            </p>
            <p>
              <strong>E-mail :</strong>{" "}
              <a href="mailto:chs.achat@gmail.com" className="text-gold-700 hover:underline">
                chs.achat@gmail.com
              </a>
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-h4 text-gray-900">2. Directeur de la publication</h2>
          <p className="mt-2">
            Le directeur de la publication est Laurent HAMAMLIAN, en sa qualité de Président de la société H.A.M LUXURY HAIR COSMETICS.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-h4 text-gray-900">3. Hébergement</h2>
          <p className="mt-2">L'application CronoCapilar est hébergée par :</p>
          <div className="mt-3 rounded-sm border border-gray-200 bg-gray-50 p-4">
            <p className="font-medium">Google Cloud Platform (Firebase Hosting)</p>
            <p>Google Ireland Limited</p>
            <p>Gordon House, Barrow Street</p>
            <p>Dublin 4, Irlande</p>
            <p className="mt-2">
              <strong>Région de stockage des données :</strong> europe-west1 (Belgique, Union européenne)
            </p>
            <p>
              <a
                href="https://firebase.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-700 hover:underline"
              >
                firebase.google.com
              </a>
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-h4 text-gray-900">4. Propriété intellectuelle</h2>
          <p className="mt-2">
            L'ensemble du contenu de l'application CronoCapilar (textes, images, logos, icônes, vidéos, code source, structure, design) est la propriété exclusive de H.A.M LUXURY HAIR COSMETICS, sauf mention contraire.
          </p>
          <p className="mt-2">
            Toute reproduction, distribution, modification, adaptation, retransmission ou publication de ces différents éléments est strictement interdite sans l'accord express par écrit de H.A.M LUXURY HAIR COSMETICS.
          </p>
          <p className="mt-2">
            Les marques, logos et signes distinctifs reproduits sur l'application sont la propriété de H.A.M LUXURY HAIR COSMETICS ou de tiers partenaires. Ils ne peuvent être utilisés sans autorisation préalable.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-h4 text-gray-900">5. Responsabilité</h2>
          <p className="mt-2">
            H.A.M LUXURY HAIR COSMETICS met tout en œuvre pour offrir aux utilisateurs des informations et des outils disponibles et vérifiés. Toutefois, nous ne pouvons garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.
          </p>
          <p className="mt-2">
            Les recommandations capillaires fournies par l'intelligence artificielle (Gemini AI) sont à titre informatif et ne remplacent pas un diagnostic médical professionnel. En cas de problème capillaire sérieux, consultez un dermatologue ou un trichologue.
          </p>
          <p className="mt-2">
            H.A.M LUXURY HAIR COSMETICS ne saurait être tenue responsable des dommages directs ou indirects résultant de l'utilisation de l'application CronoCapilar.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-h4 text-gray-900">6. Données personnelles</h2>
          <p className="mt-2">
            Pour toute information sur le traitement de vos données personnelles, veuillez consulter notre{" "}
            <Link to="/politique-de-confidentialite" className="text-gold-700 underline hover:text-gold-800">
              Politique de confidentialité
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-h4 text-gray-900">7. Droit applicable et juridiction compétente</h2>
          <p className="mt-2">
            Les présentes mentions légales sont régies par le droit français.
          </p>
          <p className="mt-2">
            En cas de litige, et à défaut d'accord amiable, les tribunaux français seront seuls compétents pour en connaître.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-h4 text-gray-900">8. Médiation</h2>
          <p className="mt-2">
            Conformément à l'article L.612-1 du Code de la consommation, nous proposons un dispositif de médiation de la consommation. L'entité de médiation retenue est :
          </p>
          <div className="mt-3 rounded-sm border border-gray-200 bg-gray-50 p-4">
            <p className="font-medium">CM2C - Chambre de la Médiation et de la Consommation</p>
            <p>4 rue de Béarn</p>
            <p>75003 Paris, France</p>
            <p className="mt-1">
              <a
                href="https://www.cm2c.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-700 hover:underline"
              >
                www.cm2c.net
              </a>
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-h4 text-gray-900">9. Contact</h2>
          <p className="mt-2">
            Pour toute question concernant ces mentions légales, vous pouvez nous contacter :
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              Par e-mail :{" "}
              <a href="mailto:chs.achat@gmail.com" className="text-gold-700 hover:underline">
                chs.achat@gmail.com
              </a>
            </li>
            <li>
              Par téléphone :{" "}
              <a href="tel:+33617767675" className="text-gold-700 hover:underline">
                +33 6 17 76 76 75
              </a>
            </li>
            <li>
              Par courrier : H.A.M LUXURY HAIR COSMETICS, 63 Avenue Claude Monet, 13014 Marseille, France
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
