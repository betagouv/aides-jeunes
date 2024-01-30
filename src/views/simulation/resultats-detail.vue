<template>
  <div>
    <LoadingModal v-if="fetching || updating">
      <p>Récupération en cours… </p>
    </LoadingModal>

    <BackButton
      class="fr-btn--secondary fr-btn--sm fr-mb-2w"
      data-testid="back-button"
      @click="goBack"
      >Retour aux résultats</BackButton
    >

    <DroitsDetails
      v-if="benefit"
      :droit="benefit"
      :droits="benefits"
      :city="situation.menage.depcom"
      :ressources-year-minus-two-captured="ressourcesYearMinusTwoCaptured"
    />
    <div class="fr-text--center">
      <DroitsContributions v-if="benefit" :droit="benefit" />
    </div>

    <Feedback v-if="benefit" />
  </div>
</template>

<script setup lang="ts">
import DroitsDetails from "@/components/droits-details.vue"
import DroitsContributions from "@/components/droits-contributions.vue"
import Feedback from "@/components/feedback.vue"
import LoadingModal from "@/components/loading-modal.vue"
import BackButton from "@/components/buttons/back-button.vue"
import StatisticsMixin from "@/mixins/statistics.js"
import Simulation from "@/lib/simulation.js"
import MockResults from "@/lib/mock-results.js"
import { EventAction } from "@lib/enums/event.js"
import { computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useStore } from "@/stores/index.js"
import { useResultsStore } from "@/stores/results-store.js"

const store = useStore()
const resultsStore = useResultsStore()
const route = useRoute()
const router = useRouter()

const benefits = computed(() => resultsStore.benefits)
const fetching = computed(() => resultsStore.fetching)
const updating = computed(() => resultsStore.updating)
const situation = computed(() => store.situation)
const benefit = computed(() => {
  const benefitId = route.params.benefitId
  const benefit = (benefits.value || []).find(function (benefit) {
    return benefit.id === benefitId
  })
  return benefit
})

const ressourcesYearMinusTwoCaptured = computed(
  () => store.ressourcesYearMinusTwoCaptured
)
onMounted(async () => {
  if (MockResults.mockResultsNeeded()) {
    MockResults.mock(route.params.benefitId)
    return
  } else if (!benefits.value) {
    await Simulation.restoreLatestSimulation()
  } else {
    const benefitId = route.params.benefitId

    StatisticsMixin.methods.sendBenefitsStatistics(
      benefits.value,
      EventAction.ShowDetails,
      benefitId.toString()
    )
  }
})

const goBack = () => {
  router.push("/simulation/resultats")
}
</script>
