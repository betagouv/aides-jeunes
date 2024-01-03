<script setup lang="ts">
import { computed } from "vue"
import BenefitPreview from "@/components/benefit-preview.vue"
import BenefitsMergedPreview from "@/components/benefits-merged-preview.vue"
import { useResultsStore } from "@/stores/results-store.js"

const resultsStore = useResultsStore()
const bafaBenefits = computed(() => resultsStore.bafaBenefits)
const benefitsWithoutBafa = computed(() => resultsStore.benefitsWithoutBafa)
const hasBafaBenefits = computed(() => resultsStore.hasBafaBenefits)
</script>

<template>
  <div
    v-for="(benefit, index) in benefitsWithoutBafa"
    :key="index"
    class="fr-mb-5w"
  >
    <BenefitPreview :benefit="benefit" />
  </div>
  <BenefitsMergedPreview
    v-if="hasBafaBenefits"
    :benefits="bafaBenefits"
    label="Aides BAFA et BAFD"
    description="Différents organismes peuvent vous aider à financer votre formation BAFA ou BAFD."
    redirection-page="aides-bafa"
  />
</template>
