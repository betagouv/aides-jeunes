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
    <div class="fr-h3">Aides BAFA et BAFD</div>
    <BackButton
      class="fr-mb-4w"
      data-testid="back-button"
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
