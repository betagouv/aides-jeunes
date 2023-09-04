<script setup lang="ts">
import { defineProps, PropType } from "vue"
import { LieuProperties } from "@lib/types/lieu.d.js"
import LieuInformations from "./lieu-informations.vue"

defineProps({
  lieu: {
    type: Object as PropType<LieuProperties>,
    required: true,
  },
})
</script>

<template>
  <div class="fr-tile fr-tile--horizontal fr-mb-6w">
    <div v-if="lieu" class="fr-container fr-p-4w">
      <h2 class="fr-tile__title fr-mb-3w" data-testid="lieu-title">
        {{ lieu.nom }}
      </h2>
      <lieu-informations :lieu="lieu" />
    </div>
    <p v-else> Aucune information disponible sur cet établissement</p>
  </div>
</template>
