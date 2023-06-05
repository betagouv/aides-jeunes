<script setup lang="ts">
import { useEtablissements } from "@/composables/use-etablissements.js"
import EtablissementLight from "@/components/etablissement-light.vue"
const { etablissements } = useEtablissements()
import { computed, ref } from "vue"

const showEtablissements = ref(false)

const etablissementsPreview = computed(() => {
  return etablissements?.value?.slice(0, 2)
})
</script>

<template>
  <div
    v-if="etablissements?.length > 0"
    data-testid="nearby-places"
    class="fr-hr fr-py-2w"
  >
    <h6 class="fr-h6">Comment me faire accompagner près de chez moi ?</h6>
    <p>
      Vous pouvez vous faire accompagner pour faire votre demande et poser
      toutes vos questions.
    </p>
    <div v-if="etablissements?.length" class="fr-mt-2w">
      <div
        v-for="(etablissement, index) in showEtablissements
          ? etablissements
          : etablissementsPreview"
        :key="index"
      >
        <EtablissementLight :etablissement="etablissement" />
      </div>
      <button
        class="fr-btn fr-btn--secondary fr-ml-2w fr-mt-2w"
        @click="showEtablissements = !showEtablissements"
      >
        <span v-if="showEtablissements">Réduire l'affichage des lieux</span>
        <span v-else>Afficher tous les lieux</span>
      </button>
    </div>
  </div>
</template>
