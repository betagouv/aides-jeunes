<template>
  <div>
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
import StatisticsMixin from "@/mixins/statistics.js"
import { EventAction } from "@lib/enums/event.js"
import { computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useStore } from "@/stores/index.js"
import { useResultsStore } from "@/stores/results.js"
import ABTestingService from "@/plugins/ab-testing-service"

const store = useStore()
const resultsStore = useResultsStore()
const route = useRoute()

const benefits = computed(() => resultsStore.benefits)
const hasBenefitsGroup = computed(() => resultsStore.hasBenefitsGroup)
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
  const benefitId = route.params.benefitId

  if (
    ABTestingService.getValues().aides_bafa ===
      "aides_bafa_fusionnees_conserve_position" &&
    benefit.value &&
    benefit.value.groupLabel &&
    hasBenefitsGroup.value
  ) {
    StatisticsMixin.methods.sendBenefitsStatistics(
      benefits.value,
      EventAction.ShowDetailsFromGroupPage,
      benefitId.toString()
    )
  } else {
    StatisticsMixin.methods.sendBenefitsStatistics(
      benefits.value,
      EventAction.ShowDetails,
      benefitId.toString()
    )
  }
})
</script>
