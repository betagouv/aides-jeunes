<script setup lang="ts">
import BenefitsList from "@/components/benefits-list.vue"
import { useResultsStore } from "@/stores/results.js"
import { computed } from "vue"
import { BenefitGroup } from "@data/types/benefits"

const resultsStore = useResultsStore()
const groupBenefits = computed(() => {
  const veloGroup = resultsStore.benefitTree.find(
    (b) => b.id === "velo-group"
  ) as BenefitGroup
  return veloGroup?.benefits
})
</script>

<template>
  <div>
    <h1 class="fr-text--lead">Aides pour acheter un vélo</h1>
    <BenefitsList
      v-if="groupBenefits"
      :benefits-and-benefit-groups="groupBenefits"
    />
    <p v-else> Aucune aide pour acheter un vélo n'a été trouvée. </p>
  </div>
</template>
