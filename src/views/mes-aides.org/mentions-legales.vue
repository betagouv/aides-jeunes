<template>
  <article class="fr-article">
    <h1 id="mentions-legales">Mentions légales</h1>

    <h2>Édition et direction de la publication</h2>
    <div>
      <p
        >Ce site est édité par l'association Mes Aides, responsable de la
        publication.</p
      >
    </div>

    <h2>Hébergement du site</h2>

    <p>Ce site est hébergé par :</p>
    <address>
      OVH SAS<br />
      2, rue Kellermann - 59100 Roubaix - France<br />
      Téléphone : +33 9 72 10 10 07
    </address>

    <h2>Accessibilité</h2>

    <p>
      La conformité aux normes d’accessibilité numérique est un objectif
      importante pour l'association.
      <a
        href="https://mes-aides.1jeune1solution.beta.gouv.fr/accessibilite"
        target="_blank"
        >La version de l'application hébergée par l'administration française a
        été auditée</a
      >
      et le simulateur respecte 85,41 % des critères du RGAA version 4.1. Les
      modifications apportées n'ont normalement pas d'impact négatif sur
      l'accessibilité.
    </p>

    <p>
      En cas de problème dans la navigation, vous pouvez nous contacter par
      email à
      <a v-mail="{ subject: 'Problème de navigation' }">{{ contactEmail }}</a
      >. Nous faisons notre possible pour résoudre les problèmes qui nous sont
      signalés.
    </p>

    <h2>Sécurité</h2>

    <p>
      Le site est protégé par un certificat électronique, matérialisé pour la
      grande majorité des navigateurs par un cadenas. Cette protection participe
      à la confidentialité des échanges.
    </p>

    <p>
      En aucun cas les services associés à la plateforme ne seront à l’origine
      d’envoi de courriels pour demander la saisie d’informations personnelles.
    </p>

    <h1>Politique de confidentialité</h1>

    <h2>Traitements des données à caractère personnel</h2>

    <h3>Identité et coordonnées du responsable de traitement</h3>

    <p
      >L'association Mes Aides est responsable du traitement. Vous pouvez nous
      contacter par email à
      <a v-mail="{ subject: 'Demande de renseignements' }">{{ contactEmail }}</a
      >.
    </p>

    <h3>Finalité du traitement</h3>

    <div>
      <p>
        L'association met en œuvre un traitement de données personnelles pour la
        réalisation d’une simulation pour identifier et afficher les différentes
        aides et accompagnements dont une personne de moins de 30 ans peut
        bénéficier sur la base de sa situation personnelle et professionnelle.
      </p>
    </div>

    <h3>Personnes concernées</h3>

    <p
      >Le traitement de données concerne les personnes qui utilisent le
      simulateur.
    </p>

    <h3>Catégories de données et sources traitées</h3>

    <p
      >Les données sont fournies directement par les personnes qui effectuent
      une simulation d’aides.</p
    >

    <h3>Destinataires des données</h3>

    <p>
      Seule l'association Mes Aides est destinataire des données collectées.
    </p>

    <h3>Durée de conservation</h3>

    <p
      >Les durées de conservation suivantes s’appliquent aux données
      collectées :</p
    >

    <ul>
      <li
        >Les données collectées dans le cadre de l’utilisation du simulateur
        sont conservées 7 jours à compter de l’utilisation du simulateur.
        Néanmoins certaines données sont conservées pendant 2 ans afin de
        réaliser des statistiques (notamment l’âge, la situation familiale, type
        de contrat de travail, commune de résidence, etc.) ;</li
      >
      <li
        >L’adresse électronique renseignée, le cas échéant, par l’utilisateur
        pour recevoir la liste des aides auxquelles il est susceptible d’être
        éligible et pour le sondage sont conservées 1 mois à compter de la
        collecte et</li
      >
      <li>Les réponses relatives au sondage sont conservées 6 mois.</li>
    </ul>

    <h3> Vos droits sur les données vous concernant </h3>

    <p>
      Vous pouvez accéder aux données à caractère personnel vous concernant.
      Vous disposez également d’un droit de rectification, d’un droit à la
      limitation du traitement de vos données à caractère personnel, et d’un
      droit d’opposition.
    </p>

    <p>
      Vous pouvez exercer ces droits, en adressant un courriel à l’attention du
      Délégué à la Protection des Données de l'association Mes Aides à :
      <a
        v-mail="{
          subject: 'Mes données',
          body: emailBody,
        }"
        >{{ contactEmail }}
      </a>
    </p>
    <MatomoOptOut />
  </article>
</template>

<script lang="ts">
import ContactEmailMixin from "@/mixins/contact-email.js"
import MatomoOptOut from "@/components/matomo-opt-out.vue"
import { useStore } from "@/stores/index.js"

export default {
  name: "MentionsLegalesMAO",
  components: { MatomoOptOut },
  mixins: [ContactEmailMixin],
  setup() {
    return {
      store: useStore(),
    }
  },
  computed: {
    emailBody() {
      return `Bonjour,

J'ai effectué une simulation sur Mes Aides le **JJ/MM/AAAA à HH:MM:SS**.

${
  this.store.simulationId
    ? `La dernière simulation que j'ai effectuée porte l'identifiant **${this.store.simulationId}**.`
    : ""
}
Voici quelques éléments que j'ai renseigné sur celle-ci pour vous aider à l'identifier.
- Date de naissance : **JJ/MM/AAAA**.
- Nombre d'enfants : …
- …

Je souhaite **supprimer** cette simulation de votre base de données.

Merci d'avance.
`
    },
  },
}
</script>
