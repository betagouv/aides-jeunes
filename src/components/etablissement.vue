<script setup lang="ts">
import { defineProps } from "vue"
import Etablissement from "@/../lib/types/etablissement.d.js"

defineProps({
  etablissement: {
    type: Object as () => Etablissement,
    required: true,
  },
})
</script>

<template>
  <div class="fr-tile fr-tile--horizontal fr-mb-6w">
    <div v-if="etablissement" class="fr-container fr-p-4w">
      <h2 class="fr-tile__title fr-mb-3w">
        {{ etablissement.nom }}
      </h2>
      <router-link
        class="fr-link fr-link--sm"
        :to="{
          name: 'etablissementInformations',
          params: {
            etablissement_id: etablissement.id,
          },
        }"
        >Voir les informations
      </router-link>
    </div>
    <p v-else> Aucune information disponible sur cet établissement</p>
  </div>
</template>
