<script setup lang="ts">
import { ref, computed } from "vue"
import { EventAction, EventCategory } from "@lib/enums/event.js"
import { useStore } from "@/stores/index.js"
import { useRoute, useRouter } from "vue-router"

const store = useStore()
const route = useRoute()
const router = useRouter()
const context = process.env.VITE_CONTEXT
const benefitsNumber = process.env.VITE_BENEFIT_COUNT

const hasExistingSituation = computed(() => store.passSanityCheck)

const aideDomains = ref([
  "logement",
  "santé",
  "famille",
  "transports",
  "études",
  "formation",
  "travail",
  "loisirs",
  "vacances",
])

const eventActionResume = EventAction.ReprendreMaSimulation
const eventCategoryHome = EventCategory.Home

const ctaLabel = computed(() =>
  hasExistingSituation.value
    ? "Commencer une nouvelle simulation"
    : "Je commence ma simulation"
)

function newSituation() {
  store.clear(route.query.external_id as string)
  next()
}

function next() {
  store.setOpenFiscaParameters()
  if (context !== "production") {
    store.verifyOpenfiscaBenefitVariables()
  }
  router.push({ name: "simulation" })
}
</script>

<template>
  <div class="fr-container">
    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
      <div class="fr-col-12 fr-col-md-6 fr-mt-2w">
        <h1 class="fr-h3 fr-mb-3w">
          <span class="mao-hero-highlight d-block">
            Évaluez vos droits à {{ benefitsNumber }} aides
          </span>
          <br class="fr-hidden fr-unhidden-sm" />
          en quelques clics.
        </h1>
        <p class="fr-text--md fr-mb-3w">
          Découvrez toutes les aides financières auxquelles vous avez droit en
          matière de
          <b
            >{{ aideDomains.slice(0, -1).join(", ") }} et
            {{ aideDomains[aideDomains.length - 1] }}</b
          >.
        </p>
        <p class="fr-text--xs fr-mb-2w fr-text--disabled">
          Avant de démarrer la simulation, pensez à vous munir de vos ressources
          et/ou de celles de vos parents si vous êtes encore à leur charge.
        </p>
        <div class="fr-btns-group fr-btns-group--inline-md">
          <button
            v-if="hasExistingSituation"
            v-analytics="{
              action: eventActionResume,
              category: eventCategoryHome,
            }"
            class="fr-btn"
            @click="next"
          >
            Reprendre ma simulation
          </button>
          <button
            v-analytics="{ action: ctaLabel, category: eventCategoryHome }"
            class="fr-btn fr-btn--lg"
            :class="hasExistingSituation ? 'fr-btn--secondary' : ''"
            data-testid="new-simulation"
            @click="newSituation"
          >
            {{ ctaLabel }}
          </button>
        </div>
        <div>
          <router-link
            class="fr-text--sm fr-link fr-fi-arrow-right-line fr-link--icon-right"
            to="/aides"
          >
            Accéder à la liste des aides
          </router-link>
        </div>
      </div>
      <div class="fr-col-12 fr-col-md-6 fr-hidden fr-unhidden-md fr-mt-2w">
        <img
          src="/img/mes-aides.org/illustration.svg"
          class="mao-hero-image"
          alt="Illustration du simulateur d'aides"
        />
      </div>
    </div>
  </div>
</template>
