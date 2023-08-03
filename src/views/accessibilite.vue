<template>
  <article class="fr-article">
    <h1>Déclaration d’accessibilité</h1>

    <p>
      L’entité s’engage à rendre son service accessible, conformément à
      l’article 47 de la loi n°2005-102 du 11 février 2005.
    </p>

    <p> Cette déclaration d’accessibilité s’applique à {{ baseURL }}. </p>

    <p>
      À ce jour, la navigation au clavier et la lecture d’écran est possible.
    </p>

    <h2>État de conformité</h2>

    <p>
      Le service est
      <strong
        >partiellement conforme avec le référentiel général d’amélioration de
        l’accessibilité (RGAA), version 4.1</strong
      >
      en raison des non-conformités et des dérogations énumérées ci-dessous.
    </p>

    <h2>Résultats des tests</h2>

    <p
      >L’audit de conformité réalisé par une experte en accessibilité web de
      l’entreprise SMILE révèle que 85,41 % des critères du RGAA version 4.1
      sont respectés.</p
    >

    <h2>Contenus non accessibles</h2>

    <h3>Non-conformité</h3>

    <ul>
      <li
        >De nombreuses anomalies vont pénaliser les utilisateurs en situation de
        handicap, naviguant ou non à l’aide de technologies d’assistance.</li
      >
      <li
        >Les non-conformités les plus bloquantes pour les utilisateurs
        concernent :
        <ul>
          <li
            >Problème de manipulation au clavier sur un composant d’interface
            (menu).</li
          >
          <li>Changement de contexte sans avertir l’utilisateur.</li>
          <li>Erreurs de validation de code.</li>
          <li>Manque d’information sur le titre de la page.</li>
          <li
            >Au niveau formulaire, étiquette manquante sur un champ de saisie,
            et absence de contrôle à la saisie sur les différentes étapes de
            simulateur.</li
          >
          <li>L’ordre de tabulation n’est pas traité correctement.</li>
        </ul>
      </li>
    </ul>

    <h2>Établissement de cette déclaration d’accessibilité</h2>

    <p
      >Cette déclaration a été établie le 8 septembre 2022 et mis à jour le 14
      décembre 2022.</p
    >

    <h3>Technologies utilisées pour la réalisation du service</h3>

    <ul>
      <li>HTML5</li>
      <li>CSS</li>
      <li>JavaScript</li>
    </ul>

    <h3>Environnement de test</h3>

    <p
      >Les vérifications de restitution de contenus ont été réalisées sur la
      base de la combinaison fournie par la base de référence du RGAA 4.1, avec
      les versions suivantes :</p
    >

    <ul>
      <li>Agent utilisateur : Firefox</li>
      <li>Technologie d’assistance : NVDA</li>
    </ul>

    <h3>Outils pour évaluer l’accessibilité</h3>

    <ul>
      <li>Wave</li>
      <li>WCAG color contrast checker</li>
      <li>Headings maps</li>
      <li>web developer toolbar</li>
      <li>Stylus</li>
      <li>Validateur en ligne du W3C</li>
      <li>Inspecteur navigateur</li>
    </ul>

    <h3>Pages du site ayant fait l’objet de la vérification de conformité</h3>
    <ul>
      <li>Page d’accueil : {{ baseURL }}/</li>
      <li>Page accessibilité : {{ baseURL }}/accessibilite</li>
      <li>Page contact : {{ baseURL }}/contact</li>
      <li>Page mentions légales : {{ baseURL }}/cgu</li>
      <li>Page aides : {{ baseURL }}/aides</li>
      <li
        >Simulateur « Mon profil » :
        {{ baseURL }}/simulation/individu/demandeur/date_naissance</li
      >
      <li>Simulateur « Mon Foyer » : {{ baseURL }}/simulation/enfants</li>
      <li
        >Simulateur « Mon Logement » :
        {{ baseURL }}/simulation/menage/statut_occupation_logement</li
      >
      <li
        >Simulateur « Mes revenus » :
        {{ baseURL }}/simulation/individu/demandeur/ressources/types</li
      >
      <li>Page résultat simulateur : {{ baseURL }}/simulation/resultats</li>
      <li
        >Page récapitulative simulateur :
        {{ baseURL }}/simulation/recapitulatif</li
      >
    </ul>

    <h2>Signaler un dysfonctionnement</h2>

    <p>
      Si vous rencontrez un défaut d’accessibilité vous empêchant d’accéder à un
      contenu ou une fonctionnalité du site, merci de nous en faire part.
    </p>
    <ul>
      <li>
        <a
          v-mail="{
            subject: 'Problème d\'accessibilité',
          }"
          >{{ contactEmail }}</a
        >
      </li>
    </ul>

    <h2>Voies de recours</h2>

    <p>
      Si vous n’obtenez pas de réponse rapide de notre part, vous êtes en droit
      de faire parvenir vos doléances ou une demande de saisine au Défenseur des
      droits :
    </p>
    <ul>
      <li
        ><a
          href="https://formulaire.defenseurdesdroits.fr/code/afficher.php?ETAPE=accueil_2016"
          target="_blank"
          title="Défenseur des droits - Nouvelle fenêtre"
          >avec le formulaire en ligne</a
        ></li
      >
      <li
        >en prenant contact avec
        <a
          href="https://www.defenseurdesdroits.fr/saisir/delegues"
          target="_blank"
          title="Défenseur des droits - Nouvelle fenêtre"
          >une personne déléguée dans votre région</a
        >
        ou
      </li>
      <li
        >en envoyant un courrier par la poste (gratuit, ne pas mettre de
        timbre), à l’adresse suivante :
        <address>
          Défenseur des droits<br />
          Libre réponse 71120<br />
          75342 Paris CEDEX 07
        </address>
      </li>
    </ul>
  </article>
</template>

<script>
import ContactEmailMixin from "@/mixins/contact-email.ts"

export default {
  name: "Accessibilite",
  mixins: [ContactEmailMixin],
  setup() {
    return {
      baseURL: process.env.VITE_BASE_URL,
    }
  },
}
</script>
