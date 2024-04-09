<script setup lang="ts">
import BenefitsList from "@/components/benefits-list.vue"
import { useResultsStore } from "@/stores/results.js"
import { computed, onMounted } from "vue"
import Simulation from "@/lib/simulation"
import { BenefitGroup } from "@data/types/benefits"

const resultsStore = useResultsStore()
const benefits = computed(() => resultsStore.benefits)
const groupBenefits = computed(() => {
  const veloGroup = resultsStore.benefitTree.find(
    (b) => b.id === "velo-group"
  ) as BenefitGroup
  return veloGroup?.benefits
})

onMounted(async () => {
  if (!benefits.value) {
    await Simulation.restoreLatestSimulation()
  }
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
