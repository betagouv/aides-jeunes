<script setup lang="ts">
import BenefitPreview from "@/components/benefit-preview.vue"
import { useRouter } from "vue-router"
import BackButton from "@/components/buttons/back-button.vue"
import { useResultsStore } from "@/stores/results-store.js"
import { computed, onMounted } from "vue"
import Simulation from "@/lib/simulation"
import LoadingModal from "@/components/loading-modal.vue"

const router = useRouter()
const resultsStore = useResultsStore()
const fetching = computed(() => resultsStore.fetching)
const updating = computed(() => resultsStore.updating)
const benefits = computed(() => resultsStore.benefits)
const bafaResultBenefits = computed(() => resultsStore.bafaBenefits)

onMounted(async () => {
  if (!benefits.value) {
    await Simulation.restoreLatestSimulation()
  }
})
</script>

<template>
  <div>
    <h1 class="fr-text--lead">Aides BAFA et BAFD</h1>
    <LoadingModal v-if="fetching || updating">
      <p>Récupération en cours…</p>
    </LoadingModal>
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
