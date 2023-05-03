<script setup lang="ts">
import { useEtablissements } from "@/composables/use-etablissements.js"
import EtablissementLight from "@/components/etablissement-light.vue"
const { etablissements, updating } = useEtablissements()
import { computed, ref } from "vue"

const showEtablissements = ref(false)

const etablissementsPreview = computed(() => {
  return etablissements?.value?.slice(0, 2)
})
</script>

<template>
  <div data-testid="nearby-places">
    <h6 class="fr-h6"> Comment me faire accompagner près de chez moi ?</h6>
    <p>
      Vous pouvez vous faire accompagner pour faire votre demande et poser
      toutes vos questions.
    </p>
    <p v-show="updating" class="fr-py-3w">
      <span
        class="fr-icon--ml fr-icon-refresh-line fr-icon-spin"
        aria-hidden="true"
      ></span
      ><span class="fr-ml-2w"
        >Récupération des lieux à proximité en cours…</span
      >
    </p>
    <div v-if="etablissements?.length && !updating" class="fr-mt-2w">
      <div
        v-for="(etablissement, index) in showEtablissements
          ? etablissements
          : etablissementsPreview"
        :key="index"
      >
        <EtablissementLight :etablissement="etablissement" />
      </div>
      <button
        v-if="etablissements.length > 2"
        class="fr-btn fr-btn--secondary fr-ml-2w fr-mt-2w"
        @click="showEtablissements = !showEtablissements"
      >
        <span v-if="showEtablissements">Réduire l'affichage des lieux</span>
        <span v-else>Afficher tous les lieux</span>
      </button>
    </div>
    <div v-if="etablissements.length === 0">
      <p class="fr-italic fr-my-2w">
        <cite>Aucun lieu n'a pu être trouvé à proximité de chez vous.</cite>
      </p>
    </div>
  </div>
</template>
