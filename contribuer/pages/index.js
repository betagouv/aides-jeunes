import Head from "next/head"
import { useEffect } from "react"
import netlifyIdentity from "netlify-identity-widget"
import Image from "next/image"
import Link from "next/link"
import ConnexionDecap from "../public/img/connexion-decap.webp"
import DetailAide from "../public/img/detail-aide.webp"
import ListeAide from "../public/img/liste-aide-critere.webp"
import Signup from "../public/img/signup-connexion.webp"

function Home() {
  useEffect(() => {
    netlifyIdentity.init()
  }, [])

  return (
    <>
      <Head>
        <title>Comment contribuer à Aides Jeunes ?</title>
        <meta
          name="description"
          content="Comment contribuer à Aides Jeunes ?"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="container">
        <h1>Comment contribuer à AidesJeunes ?</h1>
        <h2>
          Prise en main de l’outil de contribution du simulateur Aides Jeunes
        </h2>

        <section aria-labelledby="doc-purpose">
          <h3 id="doc-purpose">🎯 À quoi sert ce document&nbsp;?</h3>
          <p>
            Ce document présente les différentes étapes de prise en main de
            l’outil de contribution afin d’accompagner les administrations (CAF
            locales, départements, régions, communes) dans l’ajout de nouvelles
            aides.
          </p>
          <p>
            En complément, nous proposons des sessions de formation/prise en
            main de l’outil en visioconférence, n’hésitez pas à nous écrire pour
            convenir d&apos;un rendez-vous&nbsp;!
          </p>
        </section>

        <section aria-labelledby="doc-audience">
          <h3 id="doc-audience">💡 À qui est‑il destiné&nbsp;?</h3>
          <p>
            À toute personne au sein d’une administration qui aura pour rôle
            d’ajouter de nouvelles aides dans le simulateur.
          </p>
        </section>

        <nav className="toc" aria-label="Plan du document">
          <h3>🗺️ Plan du document</h3>
          <ol>
            <li>
              <a href="#apropos">01. À propos du simulateur</a>
            </li>
            <li>
              <a href="#ajouter">02. Vous souhaitez ajouter une aide&nbsp;?</a>
              <ol>
                <li>
                  <a href="#compte">1&nbsp;- Je me crée un compte</a>
                </li>
                <li>
                  <a href="#integrer">
                    2&nbsp;- Intégrer une nouvelle aide au simulateur
                  </a>
                </li>
                <li>
                  <a href="#valider">
                    3&nbsp;- Valider l’intégration de l’aide
                  </a>
                </li>
                <li>
                  <a href="#evolutions">
                    4&nbsp;- Si l’aide évolue dans le temps
                  </a>
                </li>
              </ol>
            </li>
            <li>
              <a href="#faq">Foire aux questions</a>
            </li>
          </ol>
        </nav>

        <section className="cta">
          <h3>Outil de contribution</h3>
          <p>Accédez à l’outil et commencez à contribuer.</p>
          <p>
            <a className="button" href="/admin/index.html">
              Ouvrir l’outil de contribution
            </a>
          </p>
        </section>

        <section aria-labelledby="guides">
          <h3 id="guides">
            Tutoriel vidéo pour ajouter une aide dans l’outil de contribution ⬇️
          </h3>

          <video controls preload="auto">
            <source
              src="https://betagouv.github.io/aides-jeunes-files/public/demo-outil-contribution.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </section>

        <section aria-labelledby="contact">
          <h3 id="contact">
            😬 Vous avez une question ou une suggestion&nbsp;?
          </h3>
          <p>
            N’hésitez pas à nous écrire pour nous les partager, cet outil
            s’améliore au fur et à mesure que vous nous faites des
            retours&nbsp;!
          </p>
        </section>

        <section id="apropos" aria-labelledby="apropos-title">
          <h2 id="apropos-title">01. À propos du simulateur</h2>

          <h3>Pourquoi ce simulateur a‑t‑il été créé&nbsp;?</h3>
          <p>
            Les moins de 30 ans, qu’ils soient étudiant(e)s, demandeurs d’emploi
            ou en décrochage scolaire, sont parmi les premières victimes de la
            crise économique. Si des aides existent au niveau national ou local,
            elles peuvent s’apparenter à un maquis difficile à naviguer pour le
            public. Conséquence&nbsp;: le non‑recours aux aides de la part des
            jeunes, par méconnaissance des dispositifs ou découragement. Ce
            non‑recours, en cascade, a un impact sur la capacité des jeunes à
            s’insérer dans la vie professionnelle ou à échapper à une situation
            de pauvreté.
          </p>
          <p>
            Bien que la cible prioritaire de ce simulateur soit les personnes de
            moins de trente ans, il peut aussi être utilisé pour aider des
            personnes de plus de trente ans à connaître leurs droits. En effet,
            tous les dispositifs nationaux et locaux sont intégrés au simulateur
            ou peuvent l’être, à condition qu’ils n’excluent pas les jeunes.
          </p>

          <h3>À quoi sert ce simulateur&nbsp;?</h3>
          <p>
            Ce simulateur permet aux personnes de voir en quelques minutes à
            quelles aides elles ont droit. Aujourd&apos;hui, le simulateur
            contient près de 900 aides et nous avons pour objectif d&apos;en
            ajouter davantage à l&apos;échelle locale, avec votre aide.
          </p>

          <h3>Où le trouver&nbsp;?</h3>
          <p>
            Le simulateur d&apos;aides de{" "}
            <Link href={"https://mes-aides.1jeune1solution.beta.gouv.fr"}>
              1Jeune1solution.gouv.fr en ligne.
            </Link>{" "}
          </p>

          <h3>Pour aller plus loin</h3>
          <ul>
            <li>
              <Link href={"https://beta.gouv.fr/startups/aides.jeunes.html"}>
                Pour plus d’informations sur la mission Aides Jeunes
              </Link>
            </li>
            <li>
              <Link href={"https://www.1jeune1solution.gouv.fr/"}>
                Pour plus d’informations sur le dispositif 1jeune1solution
              </Link>
            </li>
          </ul>
        </section>

        <section id="ajouter" aria-labelledby="ajouter-title">
          <h2 id="ajouter-title">02. Vous souhaitez ajouter une aide&nbsp;?</h2>
          <p>
            C’est une excellente nouvelle&nbsp;! Dans cette rubrique, nous vous
            guidons pour que cette démarche soit la plus simple possible pour
            vous.
          </p>

          <h3>Pourquoi ajouter de nouvelles aides&nbsp;?</h3>
          <p>
            Quelle que soit l’administration dont vous provenez, vous pouvez
            ajouter de nouvelles aides afin de leur donner davantage de
            visibilité auprès des utilisateurs et utilisatrices du simulateur.
          </p>
          <p>
            Voici un tutoriel pour vous guider pas à pas afin que vous puissiez
            ajouter des aides en complète autonomie.
          </p>

          <section id="compte" aria-labelledby="compte-title">
            <h3 id="compte-title">1&nbsp;- Je me crée un compte</h3>
            <ol>
              <li>
                <Link
                  href={"https://contribuer-aides-jeunes.netlify.app/admin/#/"}
                >
                  Accédez à l’outil de contribution.
                </Link>
              </li>
              <li>
                Cliquez sur “Se connecter avec Netlify Identity”.{" "}
                <img src={ConnexionDecap} alt={""} />
              </li>
              <li>
                Sous “Sign up”, entrez votre nom, votre mail et créez un mot de
                passe. Votre mail et votre mot de passe deviendront vos
                identifiants de connexion.
                <img src={Signup} alt={""} />
              </li>
            </ol>
            <p>
              Félicitations, votre compte a été créé et vous êtes arrivé sur
              l’outil de contribution. Vous pouvez désormais ajouter de
              nouvelles aides.
              <img src={ListeAide} alt={""} />
            </p>
          </section>

          <section id="integrer" aria-labelledby="integrer-title">
            <h3 id="integrer-title">
              2&nbsp;- Intégrer une nouvelle aide au simulateur
            </h3>
            <p>
              Pour intégrer une nouvelle aide, vous aurez besoin d’ouvrir&nbsp;:
            </p>
            <ul>
              <li>
                L’outil de contribution (la page à laquelle vous venez de vous
                connecter).
              </li>
              <li>
                Une page ou un document détaillant les conditions d’attribution
                de l’aide à ajouter.
              </li>
            </ul>
            <p>
              Voici un{" "}
              <Link
                href={
                  "https://app.claap.io/aides-jeunes/demonstration-de-l-ajout-d-une-aide-dans-l-outil-de-contribution-c-KaUHbGxVnO-Wwso7zjaazkm"
                }
              >
                tuto de 5 minutes
              </Link>{" "}
              pour comprendre comment ajouter facilement une nouvelle aide au
              simulateur.
            </p>
            <p>
              Exemple utilisé&nbsp;: le prêt d’un vélo Freevélo’v de la
              métropole de Lyon. La page détaillant les conditions d’attribution
              de l’aide utilisée est{" "}
              <Link href={"https://freevelov.grandlyon.com/je-minscris/"}>
                celle‑ci.
              </Link>
            </p>
          </section>

          <section id="valider" aria-labelledby="valider-title">
            <h3 id="valider-title">
              3&nbsp;- Valider l’intégration de l’aide dans le simulateur
            </h3>
            <p>
              Une fois les critères d’attribution indiqués grâce à l’outil de
              contribution, un membre de l’équipe relit et valide. L’aide est
              alors ajoutée et visible par les utilisateurs.
            </p>
            <p>
              Toujours avec l’exemple du prêt d’un vélo Freevélo’v, voici ce que
              voient les jeunes à la fin d’une simulation s’ils/elles
              correspondent aux critères.
            </p>
            <img src={DetailAide} alt={""} />
          </section>

          <section id="evolutions" aria-labelledby="evolutions-title">
            <h3 id="evolutions-title">
              4&nbsp;- Que se passe‑t‑il si l’aide évolue dans le temps&nbsp;?
            </h3>
            <p>
              Si les critères évoluent ou si l’aide doit être supprimée, vous
              pouvez modifier l’aide dans l’outil (section “Aides avec critères
              d’éligibilité” ou via la recherche par mot‑clé).
            </p>
            <p>
              En cas de souci, écrivez à l’équipe du simulateur&nbsp;:{" "}
              <a href="mailto:aides-jeunes@beta.gouv.fr">
                aides-jeunes@beta.gouv.fr
              </a>
              .
            </p>
          </section>
        </section>

        <section id="faq" aria-labelledby="faq-title">
          <h2 id="faq-title">Foire aux questions</h2>

          <details>
            <summary>Comment choisir une aide à intégrer&nbsp;?</summary>
            <div className="details-content">
              <p>
                Référez‑vous à{" "}
                <Link
                  href={
                    "https://github.com/betagouv/aides-jeunes/wiki/Integrer-une-nouvelle-aide-dans-mes-aides"
                  }
                >
                  cette page qui répertorie les critères à prendre en compte
                  lorsque vous évaluez la pertinence
                </Link>{" "}
                d’ajouter une aide.
              </p>
            </div>
          </details>

          <details>
            <summary>Dois‑je obligatoirement ajouter un logo&nbsp;?</summary>
            <div className="details-content">
              <p>
                Non. Le logo de votre institution s’affiche déjà par défaut
                (pré‑enregistré). Renseignez votre institution dans la liste. Le
                champ LOGO n’est à remplir que si vous souhaitez une image
                spécifique au dispositif.
              </p>
            </div>
          </details>

          <details>
            <summary>
              Si mon institution n’est pas dans la liste, que faire&nbsp;?
            </summary>
            <div className="details-content">
              <p>
                Tapez les premières lettres de votre institution. Si rien
                n’apparaît, vous pouvez ajouter votre institution via
                l’interface dédiée.
              </p>
            </div>
          </details>

          <details>
            <summary>Que dois‑je inclure&nbsp;?</summary>
            <div className="details-content">
              <p>
                Quelques lignes pour décrire la nature du dispositif.
                Exemple&nbsp;: “Cette aide vise à favoriser l’accès à la
                formation et l’insertion professionnelle des jeunes résidant en
                Bretagne en prenant en charge le financement de leur permis de
                conduire.”
              </p>
              <p>
                Écrivez de façon inclusive (ex&nbsp;: “les étudiantes et
                étudiants”). Les points médians ne sont pas autorisés sur les
                sites gouvernementaux.
              </p>
            </div>
          </details>

          <details>
            <summary>
              Où mettre les critères spécifiques (âge, géographie, etc.)&nbsp;?
            </summary>
            <div className="details-content">
              <p>
                Ne les placez pas dans la description&nbsp;: l’outil propose des
                champs dédiés pour ces critères.
              </p>
            </div>
          </details>

          <details>
            <summary>
              Quelles conditions et comment elles se cumulent&nbsp;?
            </summary>
            <div className="details-content">
              <p>
                Conditions disponibles&nbsp;: âge, géographie (communes,
                départements, régions, EPCI, exclusion d’EPCI), régime de
                sécurité sociale, quotient familial, en formation sanitaire et
                sociale, bénéficiaire RSA, intérimaire, statut d’occupation du
                logement, etc.
              </p>
              <p>
                Elles se cumulent entre elles. Ex&nbsp;: “région&nbsp;84” ET
                “quotient familial &lt; 16&nbsp;000&nbsp;€ annuel” =&gt; visible
                uniquement pour les personnes en Auvergne‑Rhône‑Alpes ET avec un
                quotient &lt; 16&nbsp;000&nbsp;€.
              </p>
            </div>
          </details>

          <details>
            <summary>Quels profils et comment cela fonctionne&nbsp;?</summary>
            <div className="details-content">
              <p>
                Profils&nbsp;: lycéen·ne, dans l’enseignement supérieur,
                scolarisé·e, stagiaire, apprenti·e, en contrat pro, en recherche
                d’emploi, salarié·e, indépendant·e, en service civique,
                bénéficiaire RSA, en situation de handicap, inactif·ve.
              </p>
              <p>
                Ces conditions ne se cumulent pas entre elles&nbsp;: choisir
                “dans l’enseignement supérieur” et “salarié·e” montre l’aide aux
                étudiant·e·s et aux salarié·e·s (pas uniquement à celles/ceux
                qui sont les deux).
              </p>
              <p>
                Vous pouvez ajouter des précisions à satisfaire simultanément
                dans un même profil (ex.&nbsp;: stagiaires boursiers de moins de
                20 ans). “Inactif ou inactive” cible les personnes “hors
                radars”.
              </p>
            </div>
          </details>

          <details>
            <summary>À quoi sert ce champ&nbsp;?</summary>
            <div className="details-content">
              <p>
                Certains critères trop précis/complexes ne sont pas pris en
                compte par le simulateur. Utilisez ce champ pour informer les
                usagers. Écrivez des critères complétant “Pour en bénéficier,
                vous devez également…”, en commençant par un verbe à
                l’infinitif.
              </p>
              <p>
                Exemples&nbsp;: Signer un CER ou un PPAE. Résider depuis au
                moins 6 mois. Ne pas bénéficier du soutien financier des
                parents.
              </p>
            </div>
          </details>

          <details>
            <summary>Conditions bénévoles à satisfaire</summary>
            <div className="details-content">
              <p>
                Si l’aide est attribuée en échange d’un engagement bénévole,
                cochez “ajouter conditions bénévoles à satisfaire” afin qu’un
                lien dynamique vers jeveuxaider.gouv.fr s’affiche et oriente
                vers des organismes à proximité.
              </p>
            </div>
          </details>

          <details>
            <summary>
              Lien vers la page d&apos;informations de référence — Est‑ce
              obligatoire&nbsp;?
            </summary>
            <div className="details-content">
              <p>
                Ce lien suit la description de l’aide. Souvent, il renvoie vers
                une page détaillant les informations de base, l’éligibilité et
                un contact ou formulaire.
              </p>
            </div>
          </details>

          <details>
            <summary>
              Liens vers un site, téléservice ou formulaire — Est‑ce
              obligatoire&nbsp;?
            </summary>
            <div className="details-content">
              <p>
                Oui, il est important de rediriger vers au moins une
                ressource&nbsp;: 1) téléservice, 2) formulaire à imprimer, 3)
                page d’instructions.
              </p>
            </div>
          </details>

          <details>
            <summary>
              Article défini (optionnel) — À quoi sert ce champ&nbsp;?
            </summary>
            <div className="details-content">
              <p>
                Spécifie l’article placé avant l’aide (ex.&nbsp;: “le RSA”). Il
                est réutilisé dans certaines phrases (ex.&nbsp;: “Le montant
                indiqué pour le RSA vous semble inexact&nbsp;?”).
              </p>
            </div>
          </details>

          <details>
            <summary>
              Type du résultat — Comment choisir et quoi renseigner&nbsp;?
            </summary>
            <div className="details-content">
              <p>
                Deux types&nbsp;: valeur numérique (ex.&nbsp;: 500&nbsp;€
                mensuels, 5 séances) ou éligibilité (oui/non, ex.&nbsp;: accès
                gratuit aux musées).
              </p>
              <p>
                Si “valeur numérique”&nbsp;: précisez l’unité (€, %, nombre), la
                périodicité (ponctuelle, mensuelle, annuelle, autre), la légende
                (ex.&nbsp;: “500&nbsp;€ maximum”) et le montant maximal.
              </p>
            </div>
          </details>

          <details>
            <summary>
              Limiter l’affichage selon un intérêt particulier&nbsp;?
            </summary>
            <div className="details-content">
              <p>
                Oui, si nécessaire. Vous pouvez cibler un public intéressé par
                le BAFA, le permis de conduire, les études à l’étranger, ou les
                formations du sanitaire et social.
              </p>
            </div>
          </details>

          <p className="top-link">
            <a href="#top">↑ Retour en haut</a>
          </p>
        </section>
      </main>

      <style jsx>{`
        .container {
          max-width: 960px;
          margin: 0 auto;
          padding: 2rem 1rem 4rem;
          line-height: 1.65;
        }
        h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        h2 {
          font-size: 1.5rem;
          margin: 1.5rem 0 0.75rem;
        }
        h3 {
          font-size: 1.15rem;
          margin: 1.25rem 0 0.5rem;
        }
        .toc {
          background: #f6f8fb;
          border: 1px solid #e6e8eb;
          border-radius: 10px;
          padding: 1rem 1.25rem;
          margin: 1rem 0 2rem;
        }
        .toc ol {
          margin: 0.25rem 0 0.25rem 1.25rem;
        }
        .cta {
          background: #fff;
          border: 1px solid #e6e8eb;
          border-radius: 10px;
          padding: 1rem 1.25rem;
          margin: 1.5rem 0 2rem;
        }
        .button {
          display: inline-block;
          padding: 0.5rem 0.9rem;
          background: #0a66ff;
          color: #fff;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
        }
        .video-item {
          list-style: none;
          margin-top: 0.5rem;
        }
        video {
          width: 100%;
          max-width: 720px;
          height: auto;
          margin-top: 0.75rem;
          border-radius: 8px;
          border: 1px solid #e6e8eb;
        }
        section {
          margin-top: 1rem;
        }
        ul,
        ol {
          padding-left: 1.25rem;
        }
        a {
          color: #0a66ff;
          text-decoration: none;
        }
        a:hover,
        a:focus {
          text-decoration: underline;
        }
        details {
          background: #fff;
          border: 1px solid #e6e8eb;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          margin: 0.75rem 0;
        }
        details summary {
          cursor: pointer;
          font-weight: 600;
          outline: none;
        }
      `}</style>
    </>
  )
}

export default Home
