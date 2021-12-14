<template>
  <div class="aj-unbox">
    <LoadingModal v-if="accessStatus.fetching || resultatStatus.updating">
      <p v-show="accessStatus.fetching">
        Récupération de la situation en cours…
      </p>
      <p v-show="resultatStatus.updating"> Calcul en cours de vos droits… </p>
    </LoadingModal>

    <div v-if="hasWarning" class="notification warning">
      <div>
        <h2>
          <i class="fa fa-warning" aria-hidden="true" /> Aucun résultat
          disponible
        </h2>
        <h3>
          La simulation à laquelle vous souhaitez accéder n‘est pas accessible.
        </h3>
        <p class="aj-results-intro">
          Pour commencer votre simulation, rendez-vous sur la
          <router-link to="home"> page d'accueil </router-link>.
        </p>
      </div>
    </div>

    <ErrorBlock v-if="hasError" />
    <ErrorSaveBlock v-if="hasErrorSave" />

    <div v-show="shouldDisplayResults">
      <div v-if="!isEmpty(droits)">
        <p class="aj-results-intro">
          D'après la situation que vous avez décrite, vous êtes a priori
          éligible à ces aides.
          <span id="print-disclaimer"
            >Ces résultats sont fondés sur les seules informations que vous avez
            indiquées et ne constituent en aucune façon un engagement de la part
            des organismes cités.</span
          >
          Les montants avancés sont arrondis à une dizaine d'euros près :
        </p>
        <div v-if="isOldSituation" class="notification warning">
          <div class="aj-results-intro">
            <h3>
              Attention, la simulation que vous voyez ne peut plus être modifiée
            </h3>
            <p>
              Si vous voulez apporter une modification à votre situation,
              veuillez recommencer une simulation depuis la
              <router-link to="home"> page d'accueil </router-link>.
            </p>
          </div>
        </div>
        <DroitsList :droits="droits" />
      </div>
      <div v-if="!isEmpty(droitsNonEligiblesShown)">
        <p>
          Les conditions des aides suivantes
          <strong>ne sont pas</strong> remplies :
        </p>
        <DroitsList ineligible :droits="droitsNonEligiblesShown" />
      </div>

      <div v-show="isEmpty(droits)" class="frame-resultats">
        <h2>
          Votre simulation n'a pas permis de découvrir de nouveaux droits.
        </h2>
        <p class="aj-results-intro">
          Si vous êtes dans une situation difficile, d'<router-link to="/sos">
            autres solutions existent </router-link
          >.
        </p>
      </div>

      <div class="aj-results-tools">
        <TrouverInterlocuteur />
        <OfflineResults
          v-if="!resultatStatus.updating && !isEmpty(droits)"
          :id="resultatsId"
        />
        <Feedback />
      </div>
    </div>
  </div>
</template>

<script>
import DroitsList from "./../../components/DroitsList"
import ErrorBlock from "./../../components/ErrorBlock"
import ErrorSaveBlock from "../../components/ErrorSaveBlock"
import Feedback from "./../../components/Feedback"
import OfflineResults from "./../../components/OfflineResults"
import TrouverInterlocuteur from "@/components/TrouverInterlocuteur"
import LoadingModal from "@/components/LoadingModal"
import ResultatsMixin from "@/mixins/Resultats"
import StatisticsMixin from "@/mixins/Statistics"

export default {
  name: "SimulationResultats",
  components: {
    DroitsList,
    ErrorBlock,
    ErrorSaveBlock,
    Feedback,
    LoadingModal,
    OfflineResults,
    TrouverInterlocuteur,
  },
  mixins: [ResultatsMixin, StatisticsMixin],
  methods: {
    isEmpty: function (array) {
      return !array || array.length === 0
    },
  },
  computed: {
    isOldSituation() {
      return !this.$store.state.answers
    },
  },
  mounted: function () {
    if (this.mock(this.$route.params.droitId)) {
      return
    } else if (this.$route.query && this.$route.query.situationId) {
      if (this.$store.state.situationId !== this.$route.query.situationId) {
        this.$store
          .dispatch("fetch", this.$route.query.situationId)
          .then(() => this.$store.dispatch("compute"))
      } else if (!this.$store.getters.hasResults) {
        this.$store.dispatch("compute")
      } // Else nothing to do
    } else if (!this.$store.getters.passSanityCheck) {
      this.restoreLatest()
    } else {
      if (this.$store.state.calculs.dirty) {
        this.$store.commit("setSaveSituationError", null)
        this.$store
          .dispatch("save")
          .then(() => {
            if (this.$store.state.access.forbidden) {
              return
            }
            return this.$store.dispatch("compute")
          })
          .catch((error) => {
            this.$store.commit(
              "setSaveSituationError",
              (error.response && error.response.data) || error
            )
            this.$matomo &&
              this.$matomo.trackEvent("General", "Erreur sauvegarde simulation")
          })
      } else if (!this.$store.getters.hasResults) {
        this.$store.dispatch("compute")
      }
    }

    let vm = this
    this.stopSubscription = this.$store.subscribe(({ type }, { calculs }) => {
      switch (type) {
        case "setResults": {
          calculs.resultats.droitsEligibles.forEach(function (d) {
            vm.$matomo && vm.$matomo.trackEvent("General", "show", d.label)
          })
          this.sendStatistics(this.droits, "show")
          break
        }
        case "saveComputationFailure": {
          vm.$matomo && vm.$matomo.trackEvent("General", "Error")
          break
        }
      }
    })
  },
  beforeUnmount: function () {
    this.stopSubscription && this.stopSubscription()
  },
}
</script>
