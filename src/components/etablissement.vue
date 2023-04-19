<script setup lang="ts">
import { defineProps, ref } from "vue"
import EtablissementInformations from "@/components/etablissement-informations.vue"

defineProps({
  etablissement: { type: Object, required: true },
})

const showInformations = ref(false)

const showInformationsButton = () => {
  console.log("showEtablissementInformations")
  showInformations.value = !showInformations.value
}
</script>
<template>
  <div class="fr-tile fr-tile--horizontal fr-mb-6w">
    <div v-if="etablissement" class="fr-container fr-p-4w">
      <h2 class="fr-tile__title fr-mb-3w">
        {{ etablissement.nom }}
      </h2>
      <button class="fr-btn fr-btn--sm" @click="showInformationsButton">
        <span v-if="!showInformations">Afficher les informations</span>
        <span v-else>Masquer les informations</span>
      </button>
      <div class="fr-mt-3w">
        <etablissement-informations
          v-if="showInformations"
          :etablissement="etablissement"
        ></etablissement-informations>
      </div>
    </div>
    <p v-else> Aucune information disponible sur cet établissement</p>
  </div>
</template>
