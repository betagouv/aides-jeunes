<script setup lang="ts">
import { defineProps, PropType } from "vue"
import { HelpingInstitution } from "@lib/types/helping-institution.d.js"
import EtablissementInformations from "./etablissement-informations.vue"

defineProps({
  etablissement: {
    type: Object as PropType<HelpingInstitution>,
    required: true,
  },
})
</script>

<template>
  <div class="fr-tile fr-tile--horizontal fr-mb-6w">
    <div v-if="etablissement" class="fr-container fr-p-4w">
      <h2 class="fr-tile__title fr-mb-3w" data-testid="etablissement-title">
        {{ etablissement.nom }}
      </h2>
      <etablissement-informations :etablissement="etablissement" />
    </div>
    <p v-else> Aucune information disponible sur cet établissement</p>
  </div>
</template>
