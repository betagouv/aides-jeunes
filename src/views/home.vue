<script setup lang="ts">
import HomeSimulationGroupButtons from "@/components/buttons/home-simulation-group-buttons.vue"
import { computed } from "vue"

const benefitsNumber = computed(() => {
  return process.env.VITE_BENEFIT_COUNT
    ? process.env.VITE_BENEFIT_COUNT
    : "plus de 700"
})
</script>

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

      <HomeSimulationGroupButtons />

      <p class="fr-text--center">
        <router-link to="/aides">
          Accéder à la liste complète des aides
        </router-link>
        <span class="fr-mx-1w">|</span>
        <router-link to="/faq">Foire aux questions</router-link>
      </p>
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
