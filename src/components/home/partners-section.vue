<template>
  <div class="fr-container fr-my-8w">
    <h2 class="fr-h3 fr-mb-4w fr-text--center">Nos partenaires</h2>
    <span class="aj-partners">
      <a
        v-for="partner in partners"
        :key="partner.id"
        :href="partner.link"
        target="_blank"
        rel="noopener noreferrer"
        class="aj-partner-link"
      >
        <picture>
          <source
            :srcset="getImagePath(partner.id, 'webp')"
            type="image/webp"
          />
          <source :srcset="getImagePath(partner.id, 'jpg')" type="image/jpeg" />
          <img
            :src="getImagePath(partner.id, 'jpg')"
            :alt="partner.name"
            class="aj-partner-logo"
            loading="lazy"
            width="200"
            height="100"
          />
        </picture>
      </a>
    </span>
  </div>
</template>

<script setup lang="ts">
const getImagePath = (id: string, format: "webp" | "jpg") =>
  `/img/partners/${id}.${format}`

interface Partner {
  id: string
  name: string
  link: string
}

const partners: Partner[] = [
  {
    id: "openfisca",
    name: "OpenFisca",
    link: "https://openfisca.org/fr/",
  },
  {
    id: "demarches-simplifiees",
    name: "Démarches Simplifiées",
    link: "https://demarches-simplifiees.fr/",
  },
  {
    id: "rdv-service-public",
    name: "RDV Service Public",
    link: "https://rdv.anct.gouv.fr/",
  },
  {
    id: "domifa",
    name: "Domifa",
    link: "https://domifa.fabrique.social.gouv.fr/",
  },
  {
    id: "mesaidesvelo",
    name: "Mesaidesvelo.fr",
    link: "https://mesaidesvelo.fr/",
  },
  {
    id: "cc-pays-chataigneraie",
    name: "Communauté de communes du Pays de la Châtaigneraie",
    link: "https://www.paysdelachataigneraie.fr/",
  },
  {
    id: "bordeaux-metropole",
    name: "Bordeaux",
    link: "https://www.bordeaux-metropole.fr/",
  },
  {
    id: "montpellier-metropole",
    name: "Montpellier",
    link: "https://www.montpellier3m.fr/",
  },
  {
    id: "toulon-metropole",
    name: "Toulon",
    link: "https://metropoletpm.fr/",
  },
  {
    id: "ville-aubervilliers",
    name: "Aubervilliers",
    link: "https://www.aubervilliers.fr/",
  },
  {
    id: "ville-vannes",
    name: "Vannes",
    link: "https://www.mairie-vannes.fr/",
  },
  {
    id: "covoiturage.beta.gouv.fr",
    name: "covoiturage.beta.gouv.fr",
    link: "https://covoiturage.beta.gouv.fr/",
  },
  {
    id: "jeunes.gouv.fr",
    name: "jeunes.gouv.fr",
    link: "https://jeunes.gouv.fr/",
  },
  {
    id: "etudiant.gouv.fr",
    name: "étudiants.gouv.fr",
    link: "https://etudiants.gouv.fr/",
  },
]
</script>
