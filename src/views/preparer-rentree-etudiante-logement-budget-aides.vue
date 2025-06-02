<script setup lang="ts">
import BackButton from "@/components/buttons/back-button.vue"
import { EventAction, EventCategory } from "@lib/enums/event"

const contactEmail = process.env.VITE_CONTACT_EMAIL

const mailContent = {
  subject: "Contact",
  body: `
        # Il est inutile de nous envoyer des documents personnels (carte de mutuelle, pièce d'identité, etc.) : nous ne pouvons pas les traiter.
        # Si vous souhaitez nous signaler une erreur, nous contacter à travers les liens proposés en fin de simulation facilite le traitement de votre demande.`,
}

const mailAnalytics = {
  action: EventAction.Contact,
  category: EventCategory.Contact,
}
</script>

<template>
  <article class="fr-article">
    <h1>👩🏻‍🎓 Tout savoir pour bien préparer ma vie étudiante</h1>
    <BackButton
      size="small"
      data-testid="benefits-liste-back-button"
      class="fr-mb-2w"
      as-link
      to="/"
      aria-label="Retour à la page d'accueil"
    >
      Retour à l'accueil
    </BackButton>
    <nav
      class="fr-summary"
      role="navigation"
      aria-labelledby="fr-summary-title"
    >
      <h2 id="fr-summary-title" class="fr-summary__title">Sommaire</h2>
      <ol>
        <li>
          <a
            id="summary-etapes-rentrée"
            class="fr-summary__link"
            href="/preparer-rentree-etudiante-logement-budget-aides#etapes-rentrée"
            >📅 Se repérer dans les grandes étapes avant la rentrée</a
          >
          <ol>
            <li>
              <a
                id="summary-jalons"
                class="fr-summary__link"
                href="/preparer-rentree-etudiante-logement-budget-aides#jalons"
                >Du lycée aux études supérieures : les jalons à ne pas
                manquer</a
              >
            </li>
            <li>
              <a
                id="summary-demarches"
                class="fr-summary__link"
                href="/preparer-rentree-etudiante-logement-budget-aides#demarches"
                >Les premières démarches à anticiper</a
              >
            </li>
          </ol>
        </li>
        <li>
          <a
            id="summary-logement"
            class="fr-summary__link"
            href="/preparer-rentree-etudiante-logement-budget-aides#logement"
            >🔑 Trouver un logement étudiant adapté à ses besoins</a
          >
          <ol>
            <li>
              <a
                id="summary-types-logement"
                class="fr-summary__link"
                href="/preparer-rentree-etudiante-logement-budget-aides#types-logement"
                >Crous, bailleurs sociaux, résidences privées : comment s'y
                retrouver ?</a
              >
            </li>
            <li>
              <a
                id="summary-bailleurs-sociaux"
                class="fr-summary__link"
                href="/preparer-rentree-etudiante-logement-budget-aides#bailleurs-sociaux"
                >🏢 Les principaux bailleurs sociaux pour étudiants</a
              >
            </li>
            <li>
              <a
                id="summary-pieges"
                class="fr-summary__link"
                href="/preparer-rentree-etudiante-logement-budget-aides#pieges"
                >Les pièges à éviter dans la recherche de logement</a
              >
            </li>
            <li>
              <a
                id="summary-urgence"
                class="fr-summary__link"
                href="/preparer-rentree-etudiante-logement-budget-aides#urgence"
                >Les solutions d'urgence en cas de galère</a
              >
            </li>
          </ol>
        </li>
        <li>
          <a
            id="summary-budget"
            class="fr-summary__link"
            href="/preparer-rentree-etudiante-logement-budget-aides#budget"
            >🧮 Faire le point sur son budget étudiant</a
          >
          <ol>
            <li>
              <a
                id="summary-depenses"
                class="fr-summary__link"
                href="/preparer-rentree-etudiante-logement-budget-aides#depenses"
                >Les principaux postes de dépense d'un étudiant</a
              >
            </li>
            <li>
              <a
                id="summary-aides-sociales"
                class="fr-summary__link"
                href="/preparer-rentree-etudiante-logement-budget-aides#aides-sociales"
                >Aides sociales et ressources disponibles</a
              >
            </li>
            <li>
              <a
                id="summary-simulation"
                class="fr-summary__link"
                href="/preparer-rentree-etudiante-logement-budget-aides#simulation"
                >Pourquoi et comment simuler ses aides dès maintenant</a
              >
            </li>
          </ol>
        </li>
        <li>
          <a
            id="summary-ressources"
            class="fr-summary__link"
            href="/preparer-rentree-etudiante-logement-budget-aides#ressources"
            >Pour aller plus loin</a
          >
        </li>
      </ol>
    </nav>

    <h2 id="etapes-rentrée"
      >📅 Se repérer dans les grandes étapes avant la rentrée</h2
    >

    <h3 id="jalons"
      >Du lycée aux études supérieures : les jalons à ne pas manquer</h3
    >
    <p>
      La transition vers la vie étudiante commence bien avant la rentrée. Tout
      débute sur Parcoursup ou MonMaster, les plateformes d'orientation vers le
      supérieur. Voici les grandes étapes à anticiper :
    </p>
    <ul>
      <li>
        <p
          ><strong>Janvier à mars</strong> : formulation des vœux sur Parcoursup
          ou dépôt des candidatures sur MonMaster.</p
        >
      </li>
      <li>
        <p
          ><strong>Mars à mai</strong> : constitution du dossier social étudiant
          (DSE) pour demander une bourse ou un logement Crous.</p
        >
      </li>
      <li>
        <p
          ><strong>Mai à juillet</strong> : réponses aux propositions
          d'admission, démarches d'inscription administrative.</p
        >
      </li>
    </ul>
    <p
      >Anticiper ces jalons permet de se concentrer plus sereinement sur la
      logistique de la rentrée.</p
    >

    <h3 id="demarches">Les premières démarches à anticiper</h3>
    <p
      >Dès que votre admission est confirmée, d'autres formalités sont à prévoir
      :</p
    >
    <ul>
      <li>
        <p
          ><strong>Paiement de la CVEC</strong> (contribution vie étudiante et
          de campus), indispensable pour s'inscrire.</p
        >
      </li>
      <li>
        <p
          ><strong
            >Affiliation à une mutuelle étudiante ou à la Complémentaire Santé
            Solidaire</strong
          >, pour garantir une bonne couverture santé.</p
        >
      </li>
      <li>
        <p
          ><strong>Souscription à une assurance logement</strong>, obligatoire
          dès la signature du bail.</p
        >
      </li>
      <li>
        <p
          ><strong>Demandes de titres de transport à tarif réduit</strong> (ex :
          carte imagine R, TER jeunes).</p
        >
      </li>
    </ul>
    <p
      >Ces démarches, simples mais nombreuses, sont plus faciles à gérer si
      elles sont planifiées dès l'été.</p
    >

    <h2 id="logement">🔑 Trouver un logement étudiant adapté à ses besoins</h2>

    <h3 id="types-logement"
      >Crous, bailleurs sociaux, résidences privées : comment s'y retrouver
      ?</h3
    >
    <p>Il existe plusieurs types de logements étudiants :</p>
    <ul>
      <li>
        <p
          ><strong>Les résidences Crous</strong>, accessibles sur dossier via le
          DSE.</p
        >
      </li>
      <li>
        <p
          ><strong>Les logements privés</strong>, plus chers et prisés sur les
          sites comme Le Bon Coin, SeLoger, Gens de Confiance et sur les
          applications comme Jinka.</p
        >
      </li>
      <li>
        <p
          ><strong>Les logements sociaux à vocation étudiante</strong>, gérés
          par des bailleurs sociaux, sont souvent méconnus des étudiants. Voici
          une liste des principaux noms pour aiguiller des recherches de
          logement sur internet :</p
        >
      </li>
    </ul>

    <h3 id="bailleurs-sociaux"
      >🏢 Les principaux bailleurs sociaux pour étudiants</h3
    >
    <ol>
      <li>
        <p
          ><strong>ARPEJ</strong> — Présent en Île-de-France, Bretagne,
          Centre-Val de Loire, Nouvelle-Aquitaine.</p
        >
      </li>
      <li>
        <p
          ><strong>Espacil Habitat</strong> — Actif en Bretagne et Pays de la
          Loire (Rennes, Nantes, Laval...).</p
        >
      </li>
      <li>
        <p
          ><strong>Hénéo (groupe RIVP)</strong> — Fortement implanté à Paris et
          en proche banlieue.</p
        >
      </li>
      <li>
        <p
          ><strong>La Nantaise d'Habitation</strong> — Acteur clé du logement
          social à Nantes.</p
        >
      </li>
      <li>
        <p
          ><strong>Unicil (groupe Action Logement)</strong> — Présent à
          Marseille, Aix, Toulon et dans le sud-est.</p
        >
      </li>
      <li>
        <p
          ><strong>Savoisienne Habitat</strong> — En Savoie et Haute-Savoie
          (Chambéry, Annecy...).</p
        >
      </li>
      <li>
        <p
          ><strong>LogiJeunes (groupe ALJT)</strong> — Réseau de foyers pour les
          16–30 ans en Île-de-France.</p
        >
      </li>
      <li>
        <p
          ><strong>Adoma (groupe CDC Habitat)</strong> — Offre nationale de
          logements pour jeunes et étudiants.</p
        >
      </li>
      <li>
        <p
          ><strong>Résidences Sociales de France (CDC Habitat)</strong> —
          Présent dans les grandes villes universitaires.</p
        >
      </li>
      <li>
        <p
          ><strong>Logement Jeunes Provence</strong> — Région PACA, résidences
          sociales pour étudiants.</p
        >
      </li>
      <li>
        <p
          ><strong>Est Métropole Habitat</strong> — Grand Lyon, offre ciblée
          jeunes et étudiants.</p
        >
      </li>
      <li>
        <p
          ><strong>Plurial Novilia (Action Logement)</strong> — Grand Est
          (Reims, Troyes, Châlons-en-Champagne...)</p
        >
      </li>
    </ol>
    <p
      >Un logement en résidence sociale peut coûter jusqu'à 40% de moins qu'un
      logement privé. Pourtant, 80% des étudiants ignorent qu'ils peuvent y
      avoir droit.</p
    >

    <h3 id="pieges">Les pièges à éviter dans la recherche de logement</h3>
    <p>
      La recherche de logement peut être source de stress, surtout pour les
      étudiants venant de loin ou sans réseau personnel et familial. Quelques
      conseils pratiques :
    </p>
    <ul>
      <li>
        <p
          ><strong>Ne jamais envoyer d'argent sans avoir visité</strong> (ou
          vérifié le bailleur).</p
        >
      </li>
      <li>
        <p
          ><strong>Privilégier les plateformes officielles</strong> (Crous,
          Lokaviz).</p
        >
      </li>
      <li>
        <p><strong>Se méfier des loyers anormalement bas</strong>.</p>
      </li>
      <li>
        <p
          ><strong>Anticiper les surcoûts</strong> liés aux visites à distance
          ou aux solutions temporaires (Airbnb, hôtels).</p
        >
      </li>
    </ul>
    <p>
      Un accompagnement est parfois possible via les services sociaux
      universitaires ou les associations locales (essayer des recherches sur
      internet avec les mots clés &lt;nom de la ville&gt; logement étudiant aide
      social association).
    </p>

    <h3 id="urgence">Les solutions d'urgence en cas de galère</h3>
    <p
      >En cas d'imprévu (refus de logement, rupture familiale, arnaque),
      plusieurs recours existent :</p
    >
    <ul>
      <li>
        <p
          ><strong>Les aides d'urgence du Crous</strong> ou de certaines
          régions.</p
        >
      </li>
      <li>
        <p
          ><strong>L'hébergement temporaire</strong> via des foyers de jeunes
          travailleurs ou des associations.</p
        >
      </li>
      <li>
        <p
          ><strong>Les assistantes sociales universitaires</strong>, qui peuvent
          aider à trouver une solution rapide.</p
        >
      </li>
    </ul>

    <h2 id="budget">🧮 Faire le point sur son budget étudiant</h2>

    <h3 id="depenses">Les principaux postes de dépense d'un étudiant</h3>
    <p>
      Selon la FAGE, un étudiant non-boursier a dû débourser en moyenne 3.157
      euros pour sa rentrée universitaire en septembre 2024. Il est primordial
      d'anticiper ces frais, qui comprennent l'installation dans un nouveau
      logement, le paiement de la CVEC, la souscription à une assurance santé,
      l'achat de fourniture scolaires ou l'abonnement aux transports.
    </p>
    <p>
      Ensuite, le budget mensuel d'un étudiant peut fortement varier en fonction
      de plusieurs paramètres :<br />
      - cohabitation avec la famille ou décohabitation<br />
      - boursier ou non-boursier<br />
      - choix de la ville universitaire (le coût du logement de la ville est
      beaucoup plus élevé à Paris et dans les autres grandes villes)
    </p>
    <p
      >Le logement représente entre 50% et 60% du budget mensuel d'un étudiant
      en moyenne. Les autres postes sont :</p
    >
    <ul>
      <li><p>Alimentation</p></li>
      <li><p>Transports</p></li>
      <li><p>Frais de santé</p></li>
      <li><p>Fournitures et équipements</p></li>
      <li><p>Activités sociales et culturelles</p></li>
    </ul>
    <p
      >Une bonne connaissance des aides disponibles permet de mieux équilibrer
      son budget.</p
    >

    <h3 id="aides-sociales">Aides sociales et ressources disponibles</h3>
    <p
      >Les aides publiques représentent jusqu'à 23% du revenu moyen d'un
      étudiant. Parmi elles :</p
    >
    <ul>
      <li>
        <p
          ><strong>APL (aide au logement)</strong> : demande à faire via la
          Caf.</p
        >
      </li>
      <li>
        <p><strong>Bourse sur critères sociaux</strong> : via le DSE.</p>
      </li>
      <li>
        <p><strong>Repas à 1€</strong> dans les restaurants universitaires.</p>
      </li>
      <li>
        <p><strong>Aides des collectivités locales</strong> (ville, région).</p>
      </li>
    </ul>
    <p>
      Attention : certaines aides ne sont pas cumulables (ex : si un étudiant
      demande l'APL et que sa famille est bénéficiaires des prestations
      familiales, ces dernières seront recalculées à la baisse par la Caf).
    </p>

    <h3 id="simulation"
      >Pourquoi et comment simuler ses aides dès maintenant</h3
    >
    <p>
      Beaucoup d'étudiants passent à côté d'aides disponibles, faute
      d'information. Le simulateur
      <a
        target="_blank"
        rel="noopener noreferrer nofollow"
        href="https://mes-aides.1jeune1solution.beta.gouv.fr/"
        >Aides Jeunes</a
      >
      permet en quelques minutes :
    </p>
    <ul>
      <li>
        <p
          >D'estimer ses droits selon sa situation (logement, statut,
          ressources)</p
        >
      </li>
      <li>
        <p>De préparer ses démarches administratives</p>
      </li>
      <li>
        <p>D'accéder à des aides parfois méconnues</p>
      </li>
    </ul>
    <p
      >Il est recommandé de simuler ses droits
      <strong>avant la rentrée</strong> pour mieux anticiper ses besoins
      financiers.</p
    >

    <div class="fr-callout fr-mt-4w fr-mb-4w">
      <h3 class="fr-callout__title">Prêt à calculer vos aides ?</h3>
      <p class="fr-callout__text">
        Simulez vos droits aux bourses sur critères sociaux, aux aides au
        logement et découvrez toutes les autres aides disponibles pour votre vie
        étudiante.
      </p>
      <div class="fr-callout__footer">
        <a
          class="fr-btn fr-btn--primary"
          href="/simulation/individu/demandeur/date_naissance"
          title="Accéder au simulateur d'aides"
        >
          Je commence ma simulation
        </a>
      </div>
    </div>

    <h2 id="ressources">Pour aller plus loin</h2>

    <h3>Ressources officielles à consulter</h3>
    <ul>
      <li>
        <p>
          <a
            target="_blank"
            rel="noopener noreferrer nofollow"
            href="https://www.parcoursup.fr/"
            >Parcoursup</a
          >
        </p>
      </li>
      <li>
        <p>
          <a
            target="_blank"
            rel="noopener noreferrer nofollow"
            href="https://monmaster.gouv.fr/formation"
            >MonMaster</a
          >
        </p>
      </li>
      <li>
        <p>
          <a
            target="_blank"
            rel="noopener noreferrer nofollow"
            href="https://www.etudiant.gouv.fr"
            >Étudiant.gouv.fr</a
          >
        </p>
      </li>
      <li>
        <p>
          <a
            target="_blank"
            rel="noopener noreferrer nofollow"
            href="https://www.service-public.fr/particuliers/actualites/A17923"
            >Service-public.fr - Parcoursup</a
          >
        </p>
      </li>
      <li>
        <p>
          <a
            target="_blank"
            rel="noopener noreferrer nofollow"
            href="https://www.service-public.fr/particuliers/actualites/A17987"
            >Service-public.fr - MonMaster</a
          >
        </p>
      </li>
      <li>
        <p>
          <a
            target="_blank"
            rel="noopener noreferrer nofollow"
            href="https://www.messervices.etudiant.gouv.fr"
            >Messervices.etudiant.gouv.fr</a
          >
        </p>
      </li>
      <li>
        <p>
          <a
            target="_blank"
            rel="noopener noreferrer nofollow"
            href="https://www.complementaire-sante-solidaire.gouv.fr/"
            >Complémentaire Santé Solidaire</a
          >
        </p>
      </li>
      <li>
        <p>
          <a
            target="_blank"
            rel="noopener noreferrer nofollow"
            href="https://www.fage.org/news/actualites-fage-federations/2024-09-04,DP-FAGE-ICDR-2024.htm"
            >FAGE, 2024</a
          >
        </p>
      </li>
    </ul>

    <h3>Simulez vos droits en quelques clics</h3>
    <p
      >Rendez-vous sur le simulateur Aides Jeunes pour une estimation
      personnalisée de vos droits :</p
    >
    <p>
      👉
      <a
        target="_blank"
        rel="noopener noreferrer nofollow"
        href="https://mes-aides.1jeune1solution.beta.gouv.fr/"
        >https://mes-aides.1jeune1solution.beta.gouv.fr/</a
      >
    </p>
    <p
      >Un outil simple, rapide et gratuit pour aborder sereinement la vie
      étudiante.</p
    >

    <h2 class="fr-text--lead fr-mt-6w">
      Vous n'avez pas trouvé la réponse à votre question dans cet article ?
    </h2>
    <p>
      Nous contacter par email :
      <a v-mail="mailContent" :v-analytics="mailAnalytics" type="mailto">{{
        contactEmail
      }}</a>
    </p>
  </article>
</template>
