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

<script lang="ts">
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

export default {
  name: "SimulationResultats",
  components: {
    WarningMessage,
    BenefitsList,
    ErrorBlock,
    ErrorSaveBlock,
    Feedback,
    LoadingModal,
    OfflineResults,
    TrouverInterlocuteur,
    Recapitulatif,
    ErrorsEmailAndSmsModal,
  },
  mixins: [StatisticsMixin],

  setup() {
    return {
      store: useStore(),
      resultsStore: useResultsStore(),
    }
  },
  computed: {
    benefits() {
      return this.resultsStore.benefits
    },
    hasWarning() {
      return this.resultsStore.hasWarning
    },
    fetching() {
      return this.resultsStore.fetching
    },
    updating() {
      return this.resultsStore.updating
    },
    error() {
      return this.resultsStore.error
    },
    hasErrorSave() {
      return this.resultsStore.hasErrorSave
    },
    isSimulationUnavailable() {
      return this.resultsStore.isSimulationUnavailable
    },
    shouldDisplayResults() {
      return this.resultsStore.shouldDisplayResults
    },
  },
  async mounted() {
    this.initializeStore()
    this.handleLegacySituationId()

    if (MockResults.mockResultsNeeded()) {
      MockResults.mock(this.$route.params.benefitId)
      return
    } else if (this.$route.query?.simulationId) {
      await this.handleSimulationIdQuery()
    } else if (!this.store.passSanityCheck) {
      await Simulation.restoreLatestSimulation()
    } else if (this.store.calculs.dirty) {
      await this.saveSimulation()
    } else if (!this.store.hasResults) {
      if (this.store.simulation.teleservice) {
        await this.redirectToTeleservice()
      } else {
        this.store.computeResults()
      }
    }
  },
  beforeUnmount() {
    this.stopSubscription?.()
  },
  methods: {
    isEmpty(array) {
      return !array || array.length === 0
    },
    sendShowStatistics() {
      this.sendBenefitsStatistics(this.benefits, EventAction.Show)
    },
    sendDisplayUnexpectedAmountLinkStatistics() {
      const benefitsWithUnexpectedAmount = this.benefits.filter((benefit) => {
        const unexpectedAmountLinkDisplayed =
          (benefit.isBaseRessourcesYearMinusTwo &&
            !this.store.ressourcesYearMinusTwoCaptured) ||
          benefit.showUnexpectedAmount

        return unexpectedAmountLinkDisplayed
      })

      this.sendBenefitsStatistics(
        benefitsWithUnexpectedAmount,
        EventAction.ShowUnexpectedAmountLink
      )
    },
    sendAccessToAnonymizedResults() {
      this.sendEventToMatomo(
        EventCategory.General,
        EventAction.AccesSimulationAnonymisee,
        daysSinceDate(new Date(this.store.simulation.dateDeValeur))
      )
    },
    initializeStore() {
      this.store.updateCurrentAnswers(this.$route.path)

      this.stopSubscription = this.store.$onAction(({ after, name }) => {
        after(() => {
          switch (name) {
            case "setResults": {
              this.sendShowStatistics()
              this.sendDisplayUnexpectedAmountLinkStatistics()
              break
            }
            case "saveComputationFailure": {
              this.sendEventToMatomo(
                EventCategory.General,
                EventAction.ErreurInitStore
              )
              break
            }
          }
        })
      })
    },
    handleLegacySituationId() {
      // Used for old links containing situationId instead of simulationId
      if (this.$route.query?.situationId) {
        this.store.setSimulationId(this.$route.query.situationId)
      }
    },
    async handleSimulationIdQuery() {
      if (
        this.store.simulationId === this.$route.query.simulationId &&
        this.store.hasResults
      ) {
        return
      }

      await this.store.fetch(this.$route.query.simulationId)

      if (this.simulationAnonymized) {
        this.sendAccessToAnonymizedResults()
        await this.store.retrieveResultsAlreadyComputed()
      } else {
        this.store.computeResults()
      }

      this.$router.replace({ simulationId: null })
    },
    async saveSimulation() {
      try {
        this.store.setSaveSituationError(null)
        await this.store.save()

        if (!this.store.access.forbidden) {
          this.store.computeResults()
        }
      } catch (error: any) {
        this.store.setSaveSituationError(error.response?.data || error)
        this.sendEventToMatomo(
          EventCategory.General,
          EventAction.ErreurSauvegardeSimulation
        )
      }
    },
  },
  async redirectToTeleservice() {
    const representation = await this.store.fetchRepresentation(
      this.store.simulation.teleservice
    )

    window.location.href = representation.destination.url
  },
}
</script>
