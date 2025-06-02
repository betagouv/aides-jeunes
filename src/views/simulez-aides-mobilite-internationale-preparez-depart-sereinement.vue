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
    <h1
      >🧭 Simulez vos aides à la mobilité internationale : préparez votre départ
      sereinement</h1
    >
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
            id="summary-mobilite-internationale"
            class="fr-summary__link"
            href="simulez-aides-mobilite-internationale-preparez-depart-sereinement#mobilite-internationale"
            >Quelles sont les principales aides à la mobilité internationale
            pour les étudiants ?</a
          >
          <ol>
            <li>
              <a
                id="summary-erasmus"
                class="fr-summary__link"
                href="simulez-aides-mobilite-internationale-preparez-depart-sereinement#erasmus"
                >🇪🇺 La bourse Erasmus+</a
              >
            </li>
            <li>
              <a
                id="summary-ami"
                class="fr-summary__link"
                href="simulez-aides-mobilite-internationale-preparez-depart-sereinement#ami"
                >🌏 L'Aide à la Mobilité Internationale (AMI)</a
              >
            </li>
          </ol>
        </li>
        <li>
          <a
            id="summary-autres-aides"
            class="fr-summary__link"
            href="simulez-aides-mobilite-internationale-preparez-depart-sereinement#autres-aides"
            >D'autres aides et bourses pour étudier à l'étranger</a
          >
        </li>
      </ol>
    </nav>

    <h2 id="mobilite-internationale"
      >Quelles sont les principales aides à la mobilité internationale pour les
      étudiants ?</h2
    >
    <h3 id="erasmus">🇪🇺 La bourse Erasmus+</h3>
    <p
      ><a
        target="_blank"
        rel="noopener noreferrer nofollow"
        href="https://agence.erasmusplus.fr/profils/vous-souhaitez-partir-a-letranger/"
        >Le programme Erasmus+</a
      >
      est l'un des dispositifs les plus connus pour soutenir la mobilité des
      étudiants en Europe. Il offre une aide financière dont le montant varie
      généralement entre 300 € et 700 € par mois, en fonction du pays de
      destination et du type de mobilité (études ou stage). Les étudiants
      inscrits dans un établissement situé dans les Outre-mer peuvent percevoir
      une allocation de 786 €, quel que soit le type de mobilité.</p
    >

    <h4>Compléments de bourse possibles :</h4>
    <ul>
      <li>
        <p
          ><strong>Complément « inclusion »</strong> : Une aide supplémentaire
          de 250 € par mois est accordée aux étudiants remplissant certains
          critères, tels que :</p
        >
        <ul>
          <li
            ><p
              >Être en situation de handicap ou d'affection longue durée
              (ALD)</p
            ></li
          >
          <li><p>Être boursier sur critères sociaux échelon 6 ou 7</p></li>
          <li
            ><p
              >Résider en zone rurale ou en quartier prioritaire de la politique
              de la ville (QPV)</p
            ></li
          >
        </ul>
      </li>
      <li>
        <p
          ><strong>Complément « voyage durable »</strong> : En choisissant un
          mode de transport écoresponsable (train, bus, covoiturage) pour se
          rendre dans le pays d'accueil, les étudiants peuvent bénéficier d'une
          aide au voyage plus importante. Des ressources sont disponibles sur le
          site
          <a
            target="_blank"
            rel="noopener noreferrer nofollow"
            href="https://erasmusbytrain.eu/"
            >Erasmus by Train</a
          >
          pour estimer le montant de ce complément selon la distance
          parcourue.</p
        >
      </li>
    </ul>

    <h4>Comment demander la bourse Erasmus+ ?</h4>
    <p
      >Pour demander la bourse Erasmus+, il faut passer par le
      <strong>service des relations internationales</strong> de votre
      établissement d'études. Vous devrez constituer un dossier avec les
      documents requis (lettre de motivation, contrat d'études ou convention de
      stage, justificatifs de situation). Pensez à indiquer si vous êtes
      éligible à un <strong>complément "inclusion"</strong> ou
      <strong>"voyage durable"</strong>. Une fois accepté, vous signerez un
      contrat Erasmus+ précisant le montant et les conditions de versement, qui
      s'effectue généralement en deux temps : une avance avant le départ, puis
      le solde au retour après remise des justificatifs. Il faut compter entre
      six et douze mois de délai avant le début de votre séjour à l'étranger.</p
    >

    <h4
      >Puis-je bénéficier de la bourse Erasmus+ si je ne suis pas citoyen de
      l'UE ?</h4
    >
    <p
      >Les ressortissants d'Islande, du Liechtenstein, de Macédoine du Nord, de
      Norvège, de Serbie et de Turquie peuvent bénéficier de la bourse Erasmus+,
      car
      <a
        target="_blank"
        rel="noopener noreferrer nofollow"
        href="https://erasmus-plus.ec.europa.eu/fr/programme-guide/part-a/eligible-countries"
        >ces pays sont associés au programme</a
      >. Pour les ressortissants d'autres pays non membres de l'UE, certaines
      options sont également disponibles, telles que les
      <strong
        ><a
          target="_blank"
          rel="noopener noreferrer nofollow"
          href="https://erasmus-plus.ec.europa.eu/fr/opportunities/opportunities-for-organisations/cooperation-among-organisations-and-institutions/erasmus-mundus-joint-masters"
          >masters communs Erasmus Mundus</a
        ></strong
      >, la
      <strong
        ><a
          target="_blank"
          rel="noopener noreferrer nofollow"
          href="https://erasmus-plus.ec.europa.eu/fr/opportunities/opportunities-for-individuals/students/studying-abroad"
          >dimension internationale des échanges</a
        ></strong
      >
      (si votre université y participe), ainsi que des
      <strong
        ><a
          target="_blank"
          rel="noopener noreferrer nofollow"
          href="https://youth.europa.eu/home_en"
          >programmes d'échanges de jeunes</a
        ></strong
      >. Étant donné que les critères d'éligibilité peuvent varier selon les
      programmes, il est recommandé de consulter les informations spécifiques
      sur les pages du programme.</p
    >

    <p
      >Il est important de noter que la bourse Erasmus+ et ses éventuels
      compléments peuvent être cumulés avec la bourse sur critères sociaux ainsi
      qu'avec l'Aide à la Mobilité Internationale (AMI). D'autres aides peuvent
      également être obtenues en fonction des conditions de cumul et des aides
      proposées par les collectivités locales.</p
    >

    <h3 id="ami">🌏 L'Aide à la Mobilité Internationale (AMI)</h3>
    <p
      ><strong
        ><a
          target="_blank"
          rel="noopener noreferrer nofollow"
          href="https://mes-aides.1jeune1solution.beta.gouv.fr/aides/aide_mobilite_internationale_eligibilite"
          >L'Aide à la Mobilité Internationale (AMI)</a
        ></strong
      >
      est une bourse mensuelle de <strong>400 €</strong> destinée aux étudiants
      boursiers sur critères sociaux ou bénéficiant d'une aide spécifique
      annuelle. Elle soutient les séjours d'études ou de stages à l'étranger,
      d'une durée comprise entre <strong>1 et 10 mois consécutifs</strong>, dans
      le cadre du cursus universitaire. L'aide est versée mensuellement par
      l'établissement, avec la possibilité d'un premier versement avant le
      départ.</p
    >

    <h4>Conditions d'éligibilité</h4>
    <ul>
      <li
        ><p
          >Être inscrit dans un établissement d'enseignement supérieur français
          préparant un diplôme national.</p
        >
      </li>
      <li
        ><p
          >Effectuer une mobilité à l'étranger intégrée au cursus, via un
          programme d'échange ou un stage.</p
        ></li
      >
      <li
        ><p
          >Être bénéficiaire d'une bourse sur critères sociaux ou d'une aide
          spécifique annuelle.</p
        ></li
      >
    </ul>

    <h4>Cumul avec d'autres aides</h4>
    <p
      >L'AMI est <strong>cumulable</strong> avec la bourse sur critères sociaux,
      la bourse au mérite, ainsi qu'avec d'autres aides comme
      <strong>Erasmus+</strong> ou les aides régionales, sous réserve des
      conditions spécifiques de chaque dispositif.</p
    >

    <h4>Comment demander l'AMI ?</h4>
    <ul>
      <li
        ><p
          >Retirer un dossier de demande auprès du
          <strong>service des relations internationales</strong> de votre
          établissement.</p
        ></li
      >
      <li
        ><p
          >Compléter le dossier en fournissant un projet détaillé de votre
          séjour à l'étranger puis déposer le dossier au service des relations
          internationales de votre établissement.</p
        ></li
      >
      <li
        ><p
          >La sélection est effectuée par le président d'université ou le chef
          d'établissement, en fonction de la qualité du projet et de sa
          cohérence avec la politique internationale de l'établissement.</p
        ></li
      >
    </ul>

    <div class="fr-callout fr-mt-4w fr-mb-4w">
      <h3 class="fr-callout__title">Envie d'en savoir plus ?</h3>
      <p class="fr-callout__text">
        Simulez vos droits aux aides Erasmus+, AMI et bourses régionales pour
        financer votre mobilité internationale. Découvrez aussi toutes les
        autres aides disponibles pour vos études.
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

    <h2 id="autres-aides"
      >D'autres aides et bourses pour étudier à l'étranger</h2
    >
    <h3>Les bourses proposées par les régions</h3>
    <p
      >De nombreuses <strong>régions françaises</strong> proposent des aides
      spécifiques pour accompagner les étudiants dans leur mobilité
      internationale. Ces bourses régionales peuvent venir
      <strong>en complément d'autres aides nationales</strong> (comme Erasmus+
      ou l'AMI) et sont généralement conditionnées à :</p
    >
    <ul>
      <li
        ><p
          >La <strong>durée</strong> de la mobilité (souvent un minimum de 4
          semaines)</p
        ></li
      >
      <li
        ><p
          >Le <strong>type de projet</strong> (études, stage ou volontariat)</p
        ></li
      >
      <li
        ><p
          >Le <strong>lieu de résidence</strong> ou d'études du candidat</p
        ></li
      >
      <li
        ><p>Des <strong>critères sociaux</strong> ou de revenus</p></li
      >
    </ul>

    <h4>📍 Hauts-de-France</h4>
    <ul>
      <li
        ><p
          ><strong>Dispositif</strong> : Bourses de mobilité internationale
          MERMOZ</p
        ></li
      >
      <li
        ><p
          ><strong>Montant</strong> : Jusqu'à 400 € par mois pour un stage, un
          séjour d'études ou de recherche.</p
        >
      </li>
      <li
        ><p
          ><strong>Lien</strong> :
          <a
            target="_blank"
            rel="noopener noreferrer nofollow"
            href="https://mes-aides.1jeune1solution.beta.gouv.fr/aides/hauts-de-france-bourse-mobilite-mermoz"
            >bourse Mermoz</a
          ></p
        ></li
      >
    </ul>

    <h4>📍 Île-de-France</h4>
    <ul>
      <li
        ><p><strong>Dispositif</strong> : Bourses Mobilité Île-de-France</p></li
      >
      <li
        ><p
          ><strong>Montant</strong> : Entre 250 € et 450 € par mois, pour une
          durée de 1 à 10 mois.</p
        ></li
      >
      <li
        ><p
          ><strong>Lien</strong> :
          <a
            target="_blank"
            rel="noopener noreferrer nofollow"
            href="https://mes-aides.1jeune1solution.beta.gouv.fr/aides/region-ile-de-france-aide-a-la-mobilite-internationale"
            >Aide à la mobilité internationale Île-de-France</a
          ></p
        ></li
      >
    </ul>

    <h4>📍 Auvergne-Rhône-Alpes</h4>
    <ul>
      <li
        ><p
          ><strong>Dispositif</strong> : Bourse Région Mobilité Internationale
          Étudiants</p
        ></li
      >
      <li
        ><p
          ><strong>Montant</strong> : 95 € par semaine pour une mobilité de 4 à
          26 semaines ; aides complémentaires possibles selon les critères
          sociaux ou en cas de handicap.</p
        ></li
      >
      <li
        ><p
          ><strong>Lien</strong> :
          <a
            target="_blank"
            rel="noopener noreferrer nofollow"
            href="https://mes-aides.1jeune1solution.beta.gouv.fr/aides/region-auvergne-rhone_alpes-bourse-mobilite-internationale-etudiants"
            >bourse mobilité Auvergne-Rhône-Alpes</a
          ></p
        ></li
      >
    </ul>

    <h4>📍 Provence-Alpes-Côte d'Azur</h4>
    <ul>
      <li
        ><p
          ><strong>Dispositif</strong> : Aide à la mobilité internationale
          étudiante (PRAME)</p
        ></li
      >
      <li
        ><p
          ><strong>Montant</strong> : 125 € par semaine, plafonné à 2 500 € par
          année universitaire ; aides complémentaires possibles pour les frais
          de visa ou en cas de handicap.</p
        ></li
      >
      <li
        ><p
          ><strong>Lien</strong> :
          <a
            target="_blank"
            rel="noopener noreferrer nofollow"
            href="https://mes-aides.1jeune1solution.beta.gouv.fr/aides/region-provence-alpes-cote-azur-programme-regional-aide-mobilite-etudiante-prame"
            >Bourse mobilité région Sud</a
          ></p
        ></li
      >
    </ul>

    <h4>📍 Bourgogne-Franche-Comté</h4>
    <ul>
      <li
        ><p><strong>Dispositif</strong> : Bourse Aquisis</p></li
      >
      <li
        ><p
          ><strong>Montant</strong> : Entre 264 € et 2 300 €, selon la durée de
          la mobilité et le quotient familial.
        </p></li
      >
      <li
        ><p
          ><strong>Lien</strong> :
          <a
            target="_blank"
            rel="noopener noreferrer nofollow"
            href="https://mes-aides.1jeune1solution.beta.gouv.fr/aides/region-bourgogne-franche-comte-etudes-etranger-aquisis"
            >Bourse Aquisis</a
          ></p
        ></li
      >
    </ul>

    <h4>📍 Bretagne</h4>
    <ul>
      <li
        ><p><strong>Dispositif</strong> : B-Monde Mobilité Individuelle</p></li
      >
      <li
        ><p
          ><strong>Montant</strong> : Forfait voyage de 150 € ; forfait
          journalier variant de 7 € à 20 € selon la destination.</p
        ></li
      >
      <li
        ><p
          ><strong>Lien</strong> :
          <a
            target="_blank"
            rel="noopener noreferrer nofollow"
            href="https://mes-aides.1jeune1solution.beta.gouv.fr/aides/bretagne-b-monde-individuel"
            >B Monde mobilité</a
          ></p
        ></li
      >
    </ul>
    <h4>📍 Centre-Val de Loire</h4>
    <ul>
      <li
        ><p><strong>Dispositif</strong> : Mobi-Centre</p></li
      >
      <li
        ><p
          ><strong>Montant</strong> : Aide au départ de 250 € + aide mensuelle
          de 150 € ; cumulable avec l'AMI et Erasmus+.</p
        ></li
      >
      <li
        ><p><strong>Lien</strong> : Bourse Mobi-Centre</p></li
      >
    </ul>

    <h4>📍 Grand Est</h4>
    <ul>
      <li
        ><p
          ><strong>Dispositif</strong> : Aide à la mobilité internationale des
          étudiants</p
        ></li
      >
      <li
        ><p><strong>Montant</strong> :</p>
        <ul>
          <li><p>Études : 500 € pour une durée minimale de 16 semaines.</p></li>
          <li><p>Stage court : 400 € pour 12 à 15 semaines.</p></li>
          <li><p>Stage long : 800 € pour 16 semaines et plus.</p></li>
        </ul>
      </li>
      <li
        ><p
          ><strong>Lien</strong> :
          <a
            target="_blank"
            rel="noopener noreferrer nofollow"
            href="https://mes-aides.1jeune1solution.beta.gouv.fr/aides/grand-est-aide-mobilite-internationale-etudiants"
            >Bourse mobilité Grand Est</a
          ></p
        ></li
      >
    </ul>
    <h4>📍 Normandie</h4>
    <ul>
      <li
        ><p><strong>Dispositif</strong> : Pass Monde</p></li
      >
      <li
        ><p
          ><strong>Montant</strong> : Variable selon le projet ; s'adresse aux
          étudiants et apprentis normands.</p
        >
      </li>
      <li
        ><p
          ><strong>Lien</strong> :
          <a
            target="_blank"
            rel="noopener noreferrer nofollow"
            href="https://mes-aides.1jeune1solution.beta.gouv.fr/aides/region_normandie-pass-monde-etudes-sup%C3%A9rieures-1"
            >Pass Monde études supérieures</a
          ></p
        ></li
      >
    </ul>
    <h4>📍 Nouvelle-Aquitaine</h4>
    <ul>
      <li
        ><p
          ><strong>Dispositif</strong> : Séjours d'études à l'étranger - Public
          Post BAC</p
        ></li
      >
      <li
        ><p
          ><strong>Montant</strong> : Variable selon la durée et le type de
          séjour.</p
        ></li
      >
      <li
        ><p
          ><strong>Lien</strong> :
          <a
            target="_blank"
            rel="noopener noreferrer nofollow"
            href="https://mes-aides.1jeune1solution.beta.gouv.fr/aides/region-nouvelle-aquitaine-sejour-etudes-etranger"
            >Séjours d'études à l'étranger</a
          ></p
        ></li
      >
    </ul>
    <h4>📍 Pays de la Loire</h4>
    <ul>
      <li
        ><p><strong>Dispositif</strong> : Envoléo</p></li
      >
      <li
        ><p
          ><strong>Montant</strong> : Forfait de 500 € ou 1 000 € versé au début
          de la mobilité.</p
        ></li
      >
      <li
        ><p
          ><strong>Lien</strong> :
          <a
            target="_blank"
            rel="noopener noreferrer nofollow"
            href="https://mes-aides.1jeune1solution.beta.gouv.fr/aides/region_pays_de_la_loire-envol%C3%A9o"
            >Bourse Envoléo</a
          ></p
        ></li
      >
    </ul>
    <h4>📍 Guyane</h4>
    <ul>
      <li
        ><p
          ><strong>Dispositif</strong> : Aide à la mobilité internationale</p
        ></li
      >
      <li
        ><p
          ><strong>Montant</strong> : 400 € par mois, ajusté selon la durée du
          séjour, l'éloignement et le coût de la vie du pays d'accueil.</p
        ></li
      >
      <li
        ><p
          ><strong>Lien</strong> :
          <a
            target="_blank"
            rel="noopener noreferrer nofollow"
            href="https://www.yana-j.fr/dispositif/aide-a-la-mobilite-internationale/"
            >Aide à la mobilité internationale</a
          ></p
        ></li
      >
    </ul>

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
