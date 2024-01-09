<script setup lang="ts">
import { computed } from "vue"
import BenefitPreview from "@/components/benefit-preview.vue"
import BenefitsMergedPreview from "@/components/benefits-merged-preview.vue"
import { useResultsStore } from "@/stores/results-store.js"
import ABTestingService from "@/plugins/ab-testing-service.js"

const resultsStore = useResultsStore()
const bafaBenefits = computed(() => resultsStore.bafaBenefits)
const benefitsWithoutBafa = computed(() => resultsStore.benefitsWithoutBafa)
const hasBafaBenefits = computed(() => resultsStore.hasBafaBenefits)
</script>

<template>
  <div>
    <BenefitPreview
      v-for="(benefit, index) in benefitsWithoutBafa"
      :key="index"
      class="fr-mb-5w"
      :benefit="benefit"
    />
    <BenefitsMergedPreview
      v-if="
        hasBafaBenefits &&
        ABTestingService.getValues().aides_bafa === 'aides_bafa_fusionnees'
      "
      :benefits="bafaBenefits"
      label="Aides BAFA et BAFD"
      logo-path="/img/benefits/logo-bafa-bafd.png"
      description="Différents organismes peuvent vous aider à financer votre formation BAFA ou BAFD."
      redirection-page="aides-bafa"
    />
    <span
      v-if="
        hasBafaBenefits &&
        ABTestingService.getValues().aides_bafa === 'aides_bafa_distinctes'
      "
    >
      <BenefitPreview
        v-for="(benefit, index) in bafaBenefits"
        :key="index"
        class="fr-mb-5w"
        :benefit="benefit"
      />
    </span>
  </div>
</template>
