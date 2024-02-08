<script setup lang="ts">
import Lieu from "@/components/lieu.vue"
import { useLieux } from "@/composables/use-lieux.js"

const { lieux, updating } = useLieux()
</script>

<template>
  <p v-show="updating">
    <span
      class="fr-icon--ml fr-icon-refresh-line fr-icon-spin"
      aria-hidden="true"
    ></span
    ><span class="fr-ml-2w">Récupération en cours…</span>
  </p>
  <div v-if="lieux?.length">
    <p>
      Voici les lieux où vous pouvez y être accompagné(e) pour faire vos
      demandes et poser toutes vos questions.
    </p>

    <div v-for="(lieu, index) in lieux" :key="index">
      <Lieu :lieu="lieu" />
    </div>
  </div>
</template>
