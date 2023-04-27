<template>
  <LoadingModal v-if="accessStatus.fetching || resultatStatus.updating">
    <p v-show="accessStatus.fetching">
      Récupération de la situation en cours…
    </p>
    <p v-show="resultatStatus.updating"> Calcul en cours de vos droits… </p>
  </LoadingModal>

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

  <div class="fr-alert fr-alert--info fr-my-1w" v-if="simulationAnonymized()">
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

  <ErrorBlock v-if="hasError" />
  <ErrorSaveBlock v-if="hasErrorSave" />
  <div v-show="shouldDisplayResults">
    <div v-if="!isEmpty(droits)">
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
      <DroitsList :droits="droits" />
    </div>

    <div v-show="isEmpty(droits)" class="fr-py-5w">
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
            <OfflineResults
              v-if="!resultatStatus.updating && !isEmpty(droits)"
              :id="resultatsId"
            />
          </div>
          <div class="fr-col-12 fr-col-md-7">
            <Feedback />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DroitsList from "@/components/droits-list.vue"
import ErrorBlock from "@/components/error-block.vue"
import ErrorSaveBlock from "@/components/error-save-block.vue"
import Feedback from "@/components/feedback.vue"
import OfflineResults from "@/components/offline-results.vue"
import TrouverInterlocuteur from "@/components/trouver-interlocuteur.vue"
import LoadingModal from "@/components/loading-modal.vue"
import ResultatsMixin from "@/mixins/resultats.js"
import StatisticsMixin from "@/mixins/statistics.ts"
import WarningMessage from "@/components/warning-message.vue"
import Recapitulatif from "./recapitulatif.vue"
import { useStore } from "@/stores/index.ts"
import { BehaviourEventTypes } from "@lib/enums/behaviour-event-types.ts"
import { daysSinceDate } from "@lib/utils.ts"

export default {
  name: "SimulationResultats",
  components: {
    WarningMessage,
    DroitsList,
    ErrorBlock,
    ErrorSaveBlock,
    Feedback,
    LoadingModal,
    OfflineResults,
    TrouverInterlocuteur,
    Recapitulatif,
  },
  mixins: [ResultatsMixin, StatisticsMixin],
  setup() {
    return {
      store: useStore(),
    }
  },
  mounted() {
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
            this.sendEventToMatomo("General", "Error")
            break
          }
        }
      })
    })

    // Used for old links containing situationId instead of simulationId
    if (this.$route.query?.situationId) {
      this.$route.query.simulationId = this.$route.query.situationId
    }
    if (this.mock(this.$route.params.droitId)) {
      return
    } else if (this.$route.query?.simulationId) {
      if (this.store.simulationId !== this.$route.query.simulationId) {
        this.store.fetch(this.$route.query.simulationId).then(() => {
          if (this.simulationAnonymized()) {
            this.sendAccessToAnonymizedResults()
          } else {
            this.store.compute()
          }
          this.$router.replace({ simulationId: null })
        })
      } // Else nothing to do
    } else if (!this.store.passSanityCheck) {
      this.restoreLatest()
    } else {
      if (this.store.calculs.dirty) {
        const vm = this
        this.store.setSaveSituationError(null)
        this.store
          .save()
          .then(() => {
            if (vm.store.access.forbidden) {
              return
            }
            return vm.store.compute()
          })
          .catch((error) => {
            this.store.setSaveSituationError(error.response?.data || error)
            this.sendEventToMatomo("General", "Erreur sauvegarde simulation")
          })
      } else if (!this.store.hasResults) {
        if (this.store.simulation.teleservice) {
          this.store
            .fetchRepresentation(this.store.simulation.teleservice)
            .then((representation) => {
              window.location.href = representation.destination.url
            })
        } else {
          this.store.compute()
        }
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
      this.sendEventsToRecorder(this.droits, BehaviourEventTypes.show)
    },
    sendDisplayUnexpectedAmountLinkStatistics() {
      const droitsWithUnexpectedAmount = this.droits.filter((droit) => {
        const unexpectedAmountLinkDisplayed =
          (droit.isBaseRessourcesYearMinusTwo &&
            !this.ressourcesYearMinusTwoCaptured) ||
          droit.showUnexpectedAmount

        return unexpectedAmountLinkDisplayed
      })

      this.sendEventsToRecorder(
        droitsWithUnexpectedAmount,
        BehaviourEventTypes.showUnexpectedAmountLink
      )
    },
    sendAccessToAnonymizedResults() {
      this.sendEventToMatomo(
        "General",
        "Accès simulation anonymisée",
        daysSinceDate(Date.parse(this.store.simulation.dateDeValeur))
      )
    },
  },
}
</script>
