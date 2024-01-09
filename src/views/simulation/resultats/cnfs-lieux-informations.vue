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
  <h3 class="fr-text"> Conseillers numériques France Services </h3>
  <div v-for="(cnfsLieu, index) in cnfsLieux" :key="index" class="fr-my-1w">
    <span class="fr-text--bold"
      >{{ capitalizeWithLower(cnfsLieu["Raison sociale"]) }} - 
    </span>
    <span class="fr-text--sm">
      <span> Adresse : {{ cnfsLieu["Adresse"] }}</span>
    </span>
  </div>
</template>
