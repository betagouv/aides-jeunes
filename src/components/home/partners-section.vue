<template>
  <div class="fr-container fr-my-8w">
    <h2 class="fr-h3 fr-mb-4w fr-text--center">Nos sources de données</h2>
    <p class="fr-text--center fr-mb-4w">Notre simulateur s'appuie sur les données officielles du gouvernement pour vous fournir des résultats fiables.</p>
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
