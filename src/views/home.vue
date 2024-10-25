<template>
  <div data-testid="home-page" class="fr-container">
    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
      <div class="fr-col-12 fr-col-md-6 fr-mt-2w">
        <h1 class="fr-h3 fr-mb-3w">
          <span class="aj-hero-highlight">
            Évaluez vos droits à {{ benefitsNumber }} aides
          </span>
          en quelques clics.
        </h1>
        <p class="fr-text--lg fr-mb-2w">
          Découvrez rapidement toutes les aides financières auxquelles vous avez
          droit dans les domaines suivants :
        </p>
        <div class="aj-domains-container fr-mb-3w">
          <span
            v-for="(domain, index) in aideDomains"
            :key="`domain-${index}`"
            class="aj-domain"
          >
            {{ domain }}
          </span>
        </div>
        <p class="fr-text--sm fr-mb-4w">
          Avant de démarrer la simulation de vos aides, pensez à vous munir de
          vos ressources et de celles de vos parents si vous êtes encore à leur
          charge.
        </p>
        <div class="fr-btns-group fr-btns-group--inline-md">
          <button
            v-if="hasExistingSituation"
            v-analytics="{
              action: eventActionResume,
              category: eventCategoryHome,
            }"
            class="fr-btn fr-btn--secondary"
            @click="next()"
          >
            Reprendre ma simulation
          </button>
          <button
            v-analytics="{ action: ctaLabel, category: eventCategoryHome }"
            class="fr-btn fr-btn--lg"
            data-testid="new-simulation"
            @click="newSituation()"
          >
            {{ ctaLabel }}
          </button>
        </div>
      </div>
      <div class="fr-col-12 fr-col-md-6 fr-hidden fr-unhidden-md fr-mt-2w">
        <img
          src="@/assets/images/home_illustration.png"
          class="aj-hero-image"
          alt="Illustration du simulateur d'aides"
        />
      </div>
    </div>
  </div>

  <div class="fr-background-alt--grey fr-py-4w fr-mt-4w">
    <div class="fr-container">
      <div class="fr-grid-row fr-grid-row--gutters">
        <div
          v-for="(feature, index) in features"
          :key="`feature-${index}}`"
          class="fr-col-12 fr-col-md-4"
        >
          <div class="fr-card fr-card--no-border">
            <div class="fr-card__body">
              <div class="fr-card__content">
                <h3 class="fr-card__title">
                  <span
                    :class="['fr-icon-' + feature.icon, 'fr-icon--lg']"
                    aria-hidden="true"
                  ></span>
                  {{ feature.title }}
                </h3>
                <p class="fr-card__desc" v-html="feature.description"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="fr-container fr-mt-8w">
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
        <h2 class="fr-h3 fr-mb-2w">Comment ça marche ?</h2>
        <ol class="fr-list">
          <li>Répondez à quelques questions sur votre situation</li>
          <li>Obtenez une estimation personnalisée des aides</li>
          <li>Accédez aux démarches pour faire vos demandes</li>
          <li>En cas de difficultés, faites vous accompagner gratuitement</li>
        </ol>
      </div>
    </div>
  </div>

  <div class="fr-background-alt--grey fr-py-6w fr-mt-6w">
    <div class="fr-container">
      <h2 class="fr-h3 fr-mb-4w">
        Ne passez à côté d'aucune aide financière
      </h2>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-6">
          <img
            src="https://betagouv.github.io/aides-jeunes-files/public/resultats_simulation.gif"
            alt="Capture d'écran de la page de résultats"
            class="fr-responsive-img fr-mb-2w"
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <ul class="fr-list fr-list--no-bullet">
            <li
              v-for="(aide, index) in aides"
              :key="`aide-${index}`"
              class="fr-mb-2w"
            >
              <a
                :href="aide.link"
                class="fr-link fr-fi-arrow-right-line fr-link--icon-right"
              >
                {{ aide.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

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

  <div class="fr-container fr-mt-4w fr-mb-8w">
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-12 fr-col-md-8 fr-col-lg-6 fr-text--center">
        <router-link
          to="/aides"
          class="fr-link fr-fi-arrow-right-line fr-link--icon-right"
          >Accéder à la liste complète des aides</router-link
        >
        <span class="fr-mx-2w">|</span>
        <router-link
          to="/faq"
          class="fr-link fr-fi-question-line fr-link--icon-right"
          >Foire aux questions</router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useStore } from "@/stores/index.js"
import { EventAction, EventCategory } from "@lib/enums/event.js"
import { useRoute, useRouter } from "vue-router"

const store = useStore()
const route = useRoute()
const router = useRouter()
const context = process.env.VITE_CONTEXT
const benefitsNumber = process.env.VITE_BENEFIT_COUNT

const eventActionResume = EventAction.ReprendreMaSimulation
const eventCategoryHome = EventCategory.Home

const aideDomains = ref([
  "Logement",
  "Santé",
  "Famille",
  "Transports",
  "Études",
  "Formation",
  "Travail",
  "Loisirs",
  "Vacances",
])

const features = ref([
  {
    icon: "timer-line",
    title: "Rapide",
    description: "Obtenez une estimation en moins de 5 minutes",
  },
  {
    icon: "money-euro-circle-line",
    title: "Gratuit",
    description: "Un service public gratuit et sans engagement",
  },
  {
    icon: "team-line",
    title: "Complet",
    description:
      "Informations à jour et vérifiées quotidiennement par <a href='https://beta.gouv.fr/startups/aides.jeunes.html#equipe'>notre équipe</a>",
  },
])

const hasExistingSituation = computed(() => store.passSanityCheck)
const ctaLabel = computed(() =>
  hasExistingSituation.value
    ? "Commencer une nouvelle simulation"
    : "Je commence ma simulation"
)

const aides = ref([
  { name: "Bourse sur critères sociaux", link: "#" },
  { name: "Prime d'Activité", link: "#" },
  { name: "RSA", link: "#" },
  { name: "ARS", link: "#" },
  { name: "Pass Sport", link: "#" },
  { name: "Allocations familiales", link: "#" },
  { name: "Aides vacances", link: "#" },
  { name: "Aides covoiturage", link: "#" },
  { name: "Aides vélo", link: "#" },
])

const partners = ref([
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
  // { name: "TZNR", logo: "/img/partners/tznr.png", link: "#" }, > Pas de site web / logo pour le moment ?
])

function newSituation() {
  store.clear(route.query.external_id as string)
  next()
}

function next() {
  store.setOpenFiscaParameters()
  if (context !== "production") {
    store.verifyBenefitVariables()
  }
  router.push({ name: "simulation" })
}
</script>
