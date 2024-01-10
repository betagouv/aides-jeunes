<script setup lang="ts">
import { useLieux } from "@/composables/use-lieux.js"
import LieuLight from "@/components/lieu-light.vue"
import CnfsLieuxPreview from "@/components/cnfs-lieux-preview.vue"
import { computed, ref } from "vue"

const { lieux, cnfsLieux } = useLieux()

const showLieux = ref(false)

const lieuxPreview = computed(() => {
  return lieux?.value?.slice(0, 2)
})

const showLieuButtonCondition = computed(() => {
  return lieux?.value?.length > 2
})
</script>

<template>
  <div
    v-if="lieux?.length > 0"
    data-testid="nearby-places"
    class="fr-hr fr-py-2w"
  >
    <h6 class="fr-h6">Comment me faire accompagner près de chez moi ?</h6>
    <p>
      Vous pouvez vous faire accompagner pour faire votre demande et poser
      toutes vos questions.
    </p>
    <div v-if="lieux?.length" class="fr-mt-2w">
      <div
        v-for="(lieu, index) in showLieux ? lieux : lieuxPreview"
        :key="index"
      >
        <LieuLight :lieu="lieu" />
      </div>
      <CnfsLieuxPreview v-if="cnfsLieux?.length && showLieux" />
      <button
        v-if="showLieuButtonCondition"
        class="fr-btn fr-btn--secondary fr-ml-2w fr-mt-2w"
        @click="showLieux = !showLieux"
      >
        <span v-if="showLieux">Réduire l'affichage des lieux</span>
        <span v-else>Afficher tous les lieux</span>
      </button>
    </div>
  </div>
</template>
