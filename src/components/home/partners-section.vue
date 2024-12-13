<template>
  <div class="fr-container fr-my-8w">
    <h2 class="fr-h3 fr-mb-4w fr-text--center">Nos partenaires</h2>
    <span class="aj-partners">
      <img
        v-for="(partner, index) in partners"
        :key="`partner-${index}`"
        :src="partner.logo"
        :alt="partner.name"
        class="aj-partner-logo"
      />
    </span>
  </div>
</template>

<script setup lang="ts">
const partners = [
  { name: "OpenFisca", logo: "/img/partners/openfisca.png", link: "#" },
  {
    name: "Démarches Simplifiées",
    logo: "/img/partners/demarches-simplifiees.png",
    link: "#",
  },
  {
    name: "RDV Service Public",
    logo: "/img/partners/rdv-service-public.png",
    link: "#",
  },
  { name: "Domifa", logo: "/img/partners/domifa.png", link: "#" },
  {
    name: "Mesaidesvelo.fr",
    logo: "/img/partners/mesaidesvelo.png",
    link: "#",
  },
  { name: "Bordeaux", logo: "/img/partners/bordeaux-metropole.png", link: "#" },
  {
    name: "Montpellier",
    logo: "/img/partners/montpellier-metropole.png",
    link: "#",
  },
  { name: "Toulon", logo: "/img/partners/toulon-metropole.png", link: "#" },
  {
    name: "Aubervilliers",
    logo: "/img/partners/ville-aubervilliers.png",
    link: "#",
  },
  {
    name: "jeunes.gouv.fr",
    logo: "/img/partners/jeunes.gouv.fr.png",
    link: "#",
  },
  {
    name: "étudiants.gouv.fr",
    logo: "/img/partners/etudiant.gouv.fr.png",
    link: "#",
  },
]
</script>
