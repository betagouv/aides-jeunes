<script setup lang="ts">
import LoadingModal from "@/components/loading-modal.vue"
import BackButton from "@/components/buttons/back-button.vue"
import StatisticsMixin from "@/mixins/statistics.js"
import { useStore } from "@/stores/index.js"
import { useResultsStore } from "@/stores/results.js"
import { daysSinceDate } from "@lib/utils.js"
import { EventAction, EventCategory } from "@lib/enums/event.js"
import Simulation from "@/lib/simulation.js"
import MockResults from "@/lib/mock-results"
import { computed, onMounted, onBeforeUnmount, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import * as Sentry from "@sentry/vue"

const resultsStore = useResultsStore()
const store = useStore()
const router = useRouter()
const route = useRoute()
const benefits = computed(() => resultsStore.benefits)
const fetching = computed(() => resultsStore.fetching)
const updating = computed(() => resultsStore.updating)
const stopSubscription = ref<(() => void) | null>(null)
const showBackButton = computed(() => {
  return (
    router.currentRoute.value.meta?.showBackToResultsButton &&
    router.currentRoute.value.name !== "resultats"
  )
})

onMounted(async () => {
  initializeStore()
  handleLegacySituationId()
  if (MockResults.mockResultsNeeded()) {
    MockResults.mock(route.params.benefitId)
    return
  } else if (route.query?.simulationId) {
    await handleSimulationIdQuery()
  } else if (!store.passSanityCheck) {
    await Simulation.restoreLatestSimulation()
  } else if (store.calculs.dirty) {
    await saveSimulation()
  } else if (!store.hasResults) {
    if (store.simulation.teleservice) {
      await redirectToTeleservice()
    } else {
      store.computeResults()
    }
  }
})

onBeforeUnmount(() => {
  stopSubscription.value?.()
})

const sendShowStatistics = () => {
  StatisticsMixin.methods.sendBenefitsStatistics(
    benefits.value,
    EventAction.Show
  )
}
const sendDisplayUnexpectedAmountLinkStatistics = () => {
  const benefitsWithUnexpectedAmount = benefits.value.filter((benefit) => {
    const unexpectedAmountLinkDisplayed =
      (benefit.isBaseRessourcesYearMinusTwo &&
        !store.ressourcesYearMinusTwoCaptured) ||
      benefit.showUnexpectedAmount

    return unexpectedAmountLinkDisplayed
  })

  StatisticsMixin.methods.sendBenefitsStatistics(
    benefitsWithUnexpectedAmount,
    EventAction.ShowUnexpectedAmountLink
  )
}

const sendAccessToAnonymizedResults = () => {
  StatisticsMixin.methods.sendEventToMatomo(
    EventCategory.General,
    EventAction.AccesSimulationAnonymisee,
    daysSinceDate(new Date(store.simulation.dateDeValeur)).toString()
  )
}
const initializeStore = () => {
  store.updateCurrentAnswers(route.path)

  stopSubscription.value = store.$onAction(({ after, name }) => {
    after(() => {
      switch (name) {
        case "setResults": {
          sendShowStatistics()
          sendDisplayUnexpectedAmountLinkStatistics()
          break
        }
        case "saveComputationFailure": {
          StatisticsMixin.methods.sendEventToMatomo(
            EventCategory.General,
            EventAction.ErreurInitStore,
            route.path
          )
          break
        }
      }
    })
  })
}
const handleLegacySituationId = () => {
  // Used for old links containing situationId instead of simulationId
  if (route.query?.situationId) {
    store.setSimulationId(route.query.situationId.toString())
  }
}
const handleSimulationIdQuery = async () => {
  if (store.simulationId === route.query.simulationId && store.hasResults) {
    return
  }

  if (route.query.simulationId) {
    await store.fetch(route.query.simulationId.toString())
  }

  if (store.simulationAnonymized) {
    sendAccessToAnonymizedResults()
    await store.retrieveResultsAlreadyComputed()
  } else {
    store.computeResults()
  }

  router.replace({ ...router.currentRoute.value, simulationId: null } as any)
}
const saveSimulation = async () => {
  try {
    store.setSaveSituationError("")
    await store.save()

    if (!store.access.forbidden) {
      store.computeResults()
    }
  } catch (error: any) {
    store.setSaveSituationError(error.response?.data || error)
    StatisticsMixin.methods.sendEventToMatomo(
      EventCategory.General,
      EventAction.ErreurSauvegardeSimulation,
      route.path
    )
    Sentry.captureException(error)
  }
}
const redirectToTeleservice = async () => {
  if (store.simulationId) {
    const representation = await store.fetchRepresentation(
      store.simulation.teleservice,
      store.simulationId
    )

    window.location.href = representation.destination.url
  }
}
</script>

<template>
  <div>
    <LoadingModal v-if="fetching || updating">
      <p>Récupération en cours…</p>
    </LoadingModal>
    <BackButton
      v-if="showBackButton"
      class="fr-btn--secondary fr-btn--sm fr-mb-2w"
      data-testid="back-button"
      fallback="/simulation/resultats"
    >
      Retour aux résultats
    </BackButton>
    <RouterView />
  </div>
</template>
