<script setup lang="ts">
import BenefitsList from "@/components/benefits-list.vue"
import { useResultsStore } from "@/stores/results.js"
import { computed } from "vue"
import { BenefitGroup } from "@data/types/benefits"
import { useRoute } from "vue-router"

const resultsStore = useResultsStore()
const route = useRoute()
const groupBenefits = computed(() => {
  const groupId = route.params.groupId
  return resultsStore.benefitTree.find((g) => g.id === groupId) as BenefitGroup
})
</script>

<template>
  <div>
    <h1 class="fr-text--lead">{{ groupBenefits?.label }}</h1>
    <BenefitsList
      v-if="groupBenefits"
      :benefits-and-benefit-groups="groupBenefits?.benefits"
    />
    <p v-else> Aucune aide n'a été trouvée.</p>
  </div>
</template>
