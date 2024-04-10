<script setup lang="ts">
import BenefitsList from "@/components/benefits-list.vue"
import { useResultsStore } from "@/stores/results.js"
import { computed } from "vue"
import { BenefitGroup } from "@data/types/benefits"

const resultsStore = useResultsStore()
const groupBenefits = computed(() => {
  const bafaBafdGroup = resultsStore.benefitTree.find(
    (b) => b.id === "bafa-bafd-group"
  ) as BenefitGroup
  return bafaBafdGroup?.benefits
})
</script>

<template>
  <div>
    <h1 class="fr-text--lead">Aides BAFA et BAFD</h1>
    <BenefitsList
      v-if="groupBenefits"
      :benefits-and-benefit-groups="groupBenefits"
    />
    <p v-else> Aucune aide BAFA ou BAFD n'a été trouvée. </p>
  </div>
</template>
