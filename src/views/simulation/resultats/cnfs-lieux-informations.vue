<script setup lang="ts">
import { useLieux } from "@/composables/use-lieux.js"
import BackButton from "@/components/buttons/back-button.vue"
import { capitalizeWithLower } from "@lib/utils.js"

const { cnfsLieux } = useLieux()
</script>
<template>
  <BackButton
    class="fr-mb-4w"
    size="small"
    @click="$router.push({ name: 'resultats' })"
    >Retour aux résultats
  </BackButton>
  <div class="fr-container">
    <h3 class="fr-text"> Conseillers numériques France Services </h3>
    <div
      v-for="(cnfsLieu, index) in cnfsLieux"
      :key="index"
      class="fr-grid-row"
    >
      <span class="fr-text--bold"
        >{{ capitalizeWithLower(cnfsLieu["Raison sociale"]) }} 
      </span>
      <span
        id="map-pin"
        class="fr-icon--sm fr-icon-map-pin-2-line"
        aria-hidden="true"
      ></span
      > 
      <span class="fr-text--sm">{{ cnfsLieu["Adresse"] }}</span>
    </div>
  </div>
</template>

<style scoped>
#map-pin::before {
  --icon-size: 1rem;
}
</style>
