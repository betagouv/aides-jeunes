<script setup lang="ts">
import { computed } from "vue"
import { EventAction, EventCategory } from "@lib/enums/event.js"
import { useStore } from "@/stores/index.js"
import { useRoute, useRouter } from "vue-router"

const store = useStore()
const route = useRoute()
const router = useRouter()
const context = process.env.VITE_CONTEXT
const benefitsNumber = process.env.VITE_BENEFIT_COUNT

const hasExistingSituation = computed(() => store.passSanityCheck)

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
          <span class="aj-hero-highlight d-block" style="color: #1e3a8a;">
            Simulateur d'aides sociales MAAS Group
          </span>
          <br class="fr-hidden fr-unhidden-sm" />
          Évaluez vos droits à {{ benefitsNumber }} aides en quelques clics.
        </h1>
        <p class="fr-text--md fr-mb-3w">
          Notre simulateur vous permet de découvrir toutes les aides financières auxquelles vous avez droit en
          matière de
          <b
            >logement, transport, santé, formation, emploi, culture, sport et
            alimentation</b
          >.
        </p>
        <p class="fr-text--md fr-mb-3w">
          <b>Avec MAAS Group</b>, vous pouvez également <b>sauvegarder vos simulations</b> et les retrouver dans votre espace personnel.
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
            style="background-color: #1e3a8a; border-color: #1e3a8a;"
            @click="next"
          >
            Reprendre ma simulation
          </button>
          <button
            v-analytics="{ action: ctaLabel, category: eventCategoryHome }"
            class="fr-btn fr-btn--lg"
            :class="hasExistingSituation ? 'fr-btn--secondary' : ''"
            style="background-color: #1e3a8a; border-color: #1e3a8a;"
            data-testid="new-simulation"
            @click="newSituation"
          >
            {{ ctaLabel }}
          </button>
        </div>
        <div class="fr-mt-2w">
          <router-link
            class="fr-text--sm fr-link fr-fi-arrow-right-line fr-link--icon-right"
            style="color: #1e3a8a;"
            to="/aides"
          >
            Accéder à la liste des aides
          </router-link>
          <span class="fr-mx-1w">|</span>
          <router-link
            class="fr-text--sm fr-link fr-fi-account-line fr-link--icon-right"
            style="color: #1e3a8a;"
            to="/suivi"
          >
            Mes simulations sauvegardées
          </router-link>
        </div>
      </div>
      <div class="fr-col-12 fr-col-md-6 fr-hidden fr-unhidden-md fr-mt-2w">
        <div style="background-color: #1e3a8a; border-radius: 8px; padding: 20px; color: white; text-align: center;">
          <h2 style="color: white; margin-bottom: 20px;">MAAS Group Simulateur</h2>
          <p style="margin-bottom: 15px;">Notre simulateur vous permet d'estimer rapidement les aides auxquelles vous avez droit.</p>
          <div style="display: flex; justify-content: space-around; margin-top: 30px;">
            <div style="text-align: center;">
              <div style="font-size: 24px; font-weight: bold;">7 min</div>
              <div>Temps moyen</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 24px; font-weight: bold;">{{ benefitsNumber }}</div>
              <div>Aides analysées</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 24px; font-weight: bold;">100%</div>
              <div>Gratuit</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
