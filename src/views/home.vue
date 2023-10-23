<template>
  <div class="fr-grid-row aj-hero-section">
    <div
      class="aj-hero-section--text fr-col fr-col-12 fr-col-md-6 fr-col--middle fr-py-6w fr-py-md-12w fr-px-4w"
      data-testid="home-hero-content"
    >
      <h1>
        <span class="aj-hero-section--text-highlight"
          >Évaluez vos droits à <br />{{ benefitsNumber }} aides
        </span>
        <br />en moins de 5 minutes.
      </h1>
      <p class="fr-text--lg fr-mb-6w">
        Avant de démarrer la simulation de vos aides, pensez à vous munir de vos
        ressources et de celles de vos parents si vous êtes encore à leur
        charge.
      </p>
      <ul class="fr-btns-group">
        <li v-if="hasExistingSituation">
          <button
            v-analytics="{
              action: eventActionResume,
              category: eventCategoryHome,
            }"
            class="fr-btn"
            @click="next()"
          >
            Reprendre ma simulation
          </button>
        </li>
        <li>
          <button
            v-if="hasExistingSituation"
            v-analytics="{ action: ctaLabel, category: eventCategoryHome }"
            class="fr-btn fr-btn--secondary"
            data-testid="new-simulation"
            @click="newSituation()"
          >
            {{ ctaLabel }}
          </button>
          <router-link
            v-else
            v-analytics="{ action: ctaLabel, category: eventCategoryHome }"
            class="fr-btn"
            data-testid="new-simulation"
            to="/simulation/individu/demandeur/date_naissance"
            @click="newSituation()"
          >
            {{ ctaLabel }}
          </router-link>
        </li>
      </ul>
    </div>
    <div class="fr-col fr-col-6 fr-col--bottom fr-hidden fr-unhidden-md">
      <img
        src="@/assets/images/home_illustration.png"
        class="aj-hero-section--img"
        alt=""
      />
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "@/stores/index.js"
import { EventAction, EventCategory } from "@lib/enums/event.js"

export default {
  name: "Home",
  setup() {
    return {
      store: useStore(),
      context: process.env.VITE_CONTEXT,
    }
  },
  data() {
    return {
      eventCategoryHome: EventCategory.Home,
      eventActionResume: EventAction.ReprendreMaSimulation,
    }
  },
  computed: {
    hasExistingSituation() {
      return this.store.passSanityCheck
    },
    ctaLabel() {
      return this.hasExistingSituation
        ? "Commencer une nouvelle simulation"
        : "Je commence"
    },
    ctaSize() {
      return this.hasExistingSituation ? "large" : "xlarge"
    },
    benefitsNumber() {
      return process.env.VITE_BENEFIT_COUNT
        ? process.env.VITE_BENEFIT_COUNT
        : "plus de 700"
    },
  },
  methods: {
    newSituation() {
      this.store.clear(this.$route.query.external_id)
      this.next()
    },
    next() {
      this.store.setOpenFiscaParameters()
      // we only want to look for benefit variables in preview mode
      if (process.env.VITE_CONTEXT !== "production") {
        this.store.verifyBenefitVariables()
      }
      this.$push()
    },
  },
}
</script>
