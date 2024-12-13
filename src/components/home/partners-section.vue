<template>
  <div class="fr-container fr-my-8w">
    <h2 class="fr-h3 fr-mb-4w fr-text--center">Nos partenaires</h2>
    <span class="aj-partners">
      <a
        v-for="(partner, index) in partners"
        :key="`partner-${index}`"
        :href="partner.link"
        target="_blank"
        rel="noopener noreferrer"
        class="aj-partner-link"
      >
        <img :src="partner.logo" :alt="partner.name" class="aj-partner-logo" />
      </a>
    </span>
  </div>
</template>

<script setup lang="ts">
const partners = [
  {
    name: "OpenFisca",
    logo: "/img/partners/openfisca.png",
    link: "https://openfisca.org/fr/",
  },
  {
    name: "Démarches Simplifiées",
    logo: "/img/partners/demarches-simplifiees.png",
    link: "https://demarches-simplifiees.fr/",
  },
  {
    name: "RDV Service Public",
    logo: "/img/partners/rdv-service-public.png",
    link: "https://rdv.anct.gouv.fr/",
  },
  {
    name: "Domifa",
    logo: "/img/partners/domifa.png",
    link: "https://domifa.fabrique.social.gouv.fr/",
  },
  {
    name: "Mesaidesvelo.fr",
    logo: "/img/partners/mesaidesvelo.png",
    link: "https://mesaidesvelo.fr/",
  },
  {
    name: "Bordeaux",
    logo: "/img/partners/bordeaux-metropole.png",
    link: "https://www.bordeaux-metropole.fr/",
  },
  {
    name: "Montpellier",
    logo: "/img/partners/montpellier-metropole.png",
    link: "https://www.montpellier3m.fr/",
  },
  {
    name: "Toulon",
    logo: "/img/partners/toulon-metropole.png",
    link: "https://metropoletpm.fr/",
  },
  {
    name: "Aubervilliers",
    logo: "/img/partners/ville-aubervilliers.png",
    link: "https://www.aubervilliers.fr/",
  },
  {
    name: "jeunes.gouv.fr",
    logo: "/img/partners/jeunes.gouv.fr.png",
    link: "https://jeunes.gouv.fr/",
  },
  {
    name: "étudiants.gouv.fr",
    logo: "/img/partners/etudiant.gouv.fr.png",
    link: "https://etudiants.gouv.fr/",
  },
]
</script>
