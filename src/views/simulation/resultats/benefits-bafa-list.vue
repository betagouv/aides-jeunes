<script setup lang="ts">
import BenefitsList from "@/components/benefits-list.vue"
import { useResultsStore } from "@/stores/results.js"
import { computed, onMounted } from "vue"
import Simulation from "@/lib/simulation"
import { BenefitGroup } from "@data/types/benefits"

const resultsStore = useResultsStore()
const benefits = computed(() => resultsStore.benefits)
const groupBenefits = computed(() => {
  const bafaBafdGroup = resultsStore.benefitTree.find(
    (b) => b.id === "bafa-bafd-group"
  ) as BenefitGroup
  return bafaBafdGroup?.benefits
})

onMounted(async () => {
  if (!benefits.value) {
    await Simulation.restoreLatestSimulation()
  }
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
