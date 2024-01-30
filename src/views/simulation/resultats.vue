<template>
  <LoadingModal v-if="fetching || updating">
    <p v-show="fetching"> Récupération de la situation en cours… </p>
    <p v-show="updating"> Calcul en cours de vos droits… </p>
  </LoadingModal>

  <ErrorsEmailAndSmsModal />

  <WarningMessage v-if="hasWarning">
    <div>
      <h2 class="fr-text--lead"> Aucun résultat disponible </h2>
      <h3 class="fr-text--lg">
        La simulation à laquelle vous souhaitez accéder n‘est pas accessible.
      </h3>
      <p class="fr-text--lg">
        Pour commencer votre simulation, rendez-vous sur la
        <router-link to="home"> page d'accueil</router-link>
        .
      </p>
    </div>
  </WarningMessage>

  <div v-if="isSimulationUnavailable" class="fr-alert fr-alert--info fr-my-1w">
    <div>
      <h2 class="fr-text--lead">
        Vos résultats de simulation ne sont plus disponibles
      </h2>
      <h3 class="fr-text--lg">
        La simulation à laquelle vous souhaitez accéder n‘est plus accessible.
      </h3>
      <p class="fr-text--lg">
        Pour commencer une nouvelle simulation, rendez-vous sur la
        <router-link to="home"> page d'accueil</router-link>
        .
      </p>
    </div>
  </div>

  <ErrorBlock v-if="error" />
  <ErrorSaveBlock v-if="hasErrorSave" />
  <div v-show="shouldDisplayResults">
    <div v-if="!isEmpty(benefits)">
      <p class="fr-text--lg">
        D'après la situation que vous avez décrite, vous êtes a priori éligible
        à ces aides.
        <span id="print-disclaimer"
          >Ces résultats sont fondés sur les seules informations que vous avez
          indiquées et ne constituent en aucune façon un engagement de la part
          des organismes cités.</span
        >
        Les montants avancés sont arrondis à une dizaine d'euros près :
      </p>
      <BenefitsList :benefits="benefits" />
    </div>

    <div v-show="isEmpty(benefits)" class="fr-py-5w">
      <h2 class="fr-text--lead">
        Votre simulation n'a pas permis de découvrir de nouveaux droits.
      </h2>
      <p class="fr-text--lg">
        Nous mettons à jour régulièrement le simulateur en ajoutant de nouvelles
        aides. N'hésitez pas à faire une simulation dans les prochains mois.
      </p>
    </div>

    <div class="fr-print-only">
      <Recapitulatif />
    </div>

    <div class="fr-print-hidden">
      <TrouverInterlocuteur />

      <div class="fr-container fr-px-0 fr-mb-0 fr-py-2w">
        <div class="fr-grid-row fr-grid-row--gutters">
          <div class="fr-col-12 fr-col-md-5">
            <OfflineResults v-if="!updating && !isEmpty(benefits)" />
          </div>
          <div class="fr-col-12 fr-col-md-7">
            <Feedback />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BenefitsList from "@/components/benefits-list.vue"
import ErrorBlock from "@/components/error-block.vue"
import ErrorSaveBlock from "@/components/error-save-block.vue"
import Feedback from "@/components/feedback.vue"
import OfflineResults from "@/components/offline-results.vue"
import TrouverInterlocuteur from "@/components/trouver-interlocuteur.vue"
import LoadingModal from "@/components/loading-modal.vue"
import StatisticsMixin from "@/mixins/statistics.js"
import WarningMessage from "@/components/warning-message.vue"
import Recapitulatif from "./recapitulatif.vue"
import { useStore } from "@/stores/index.js"
import { useResultsStore } from "@/stores/results-store.js"
import { daysSinceDate } from "@lib/utils.js"
import { EventAction, EventCategory } from "@lib/enums/event.js"
import ErrorsEmailAndSmsModal from "@/components/modals/errors-email-and-sms-modal.vue"
import Simulation from "@/lib/simulation.js"
import MockResults from "@/lib/mock-results"
import { computed, onMounted, onBeforeUnmount, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

const resultsStore = useResultsStore()
const store = useStore()
const router = useRouter()
const route = useRoute()
const benefits = computed(() => resultsStore.benefits)
const hasWarning = computed(() => resultsStore.hasWarning)
const fetching = computed(() => resultsStore.fetching)
const updating = computed(() => resultsStore.updating)
const error = computed(() => resultsStore.error)
const hasErrorSave = computed(() => resultsStore.hasErrorSave)
const isSimulationUnavailable = computed(
  () => resultsStore.isSimulationUnavailable
)
const shouldDisplayResults = computed(() => resultsStore.shouldDisplayResults)
const stopSubscription = ref<(() => void) | null>(null)

onMounted(async () => {
  initializeStore()
  handleLegacySituationId()
  if (MockResults.mockResultsNeeded()) {
    MockResults.mock(route.params.benefitId)
    return
  } else if (route.query?.simulationId) {
    await handleSimulationIdQuery()
  } else if (!store.passSanityCheck) {
    await restoreLatestSimulation()
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

const restoreLatestSimulation = async () => {
  const lastestSimulationId = Simulation.getLatestId()
  if (!lastestSimulationId) {
    StatisticsMixin.methods.sendEventToMatomo(
      EventCategory.General,
      EventAction.Redirection,
      route.path
    )

    return store.redirection((route) => router.push(route))
  }

  StatisticsMixin.methods.sendEventToMatomo(
    EventCategory.General,
    EventAction.CalculResultatsRestauration,
    route.path
  )

  await store.fetch(lastestSimulationId)

  if (store.simulationAnonymized) {
    await store.retrieveResultsAlreadyComputed()
  } else {
    store.computeResults()
  }
}

const isEmpty = (array) => {
  return !array || array.length === 0
}
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
