<script setup lang="ts">
import BenefitPreview from "@/components/benefit-preview.vue"
import { useRouter } from "vue-router"
import BackButton from "@/components/buttons/back-button.vue"
import { useResultsStore } from "@/stores/results-store"
import { computed } from "vue"

const router = useRouter()
const resultsStore = useResultsStore()
const bafaResultBenefits = computed(() => resultsStore.bafaBenefits)
</script>

<template>
  <div>
    <h3 class="fr-h3">Aides BAFA et BAFD</h3>
    <BackButton
      class="fr-mb-4w"
      size="small"
      @click="router.push({ name: 'resultats' })"
      >Retour aux résultats
    </BackButton>
    <div
      v-for="(benefit, index) in bafaResultBenefits"
      :key="index"
      class="fr-mb-5w"
    >
      <BenefitPreview :benefit="benefit" />
    </div>
  </div>
</template>
