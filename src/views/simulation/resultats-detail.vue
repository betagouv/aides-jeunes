<template>
  <div class="aj-unbox">
    <LoadingModal v-if="accessStatus.fetching || resultatStatus.updating">
      <p v-show="accessStatus.fetching">
        Récupération de la situation en cours…
      </p>
      <p v-show="resultatStatus.updating"> Récupération de vos droits… </p>
    </LoadingModal>

    <BackButton
      class="fr-btn--secondary fr-btn--sm fr-mb-2w"
      data-testid="back-button"
      @click="goBack"
      >Retour aux résultats</BackButton
    >

    <DroitsDetails
      v-if="droit"
      :droit="droit"
      :droits="droits"
      :city="situation.menage.depcom"
      :patrimoine-captured="patrimoineCaptured"
      :ressources-year-minus-two-captured="ressourcesYearMinusTwoCaptured"
    />
    <div class="fr-text--center">
      <DroitsContributions v-if="droit" :droit="droit" />
    </div>

    <div class="aj-box normal-padding-bottom aj-results-details-feedback-box">
      <Feedback v-if="droit" />
    </div>
  </div>
</template>

<script>
import DroitsDetails from "../../components/droits-details.vue"
import DroitsContributions from "../../components/droits-contributions.vue"
import Feedback from "@/components/feedback.vue"
import LoadingModal from "@/components/loading-modal.vue"
import ResultatsMixin from "@/mixins/resultats"
import StatisticsMixin from "@/mixins/statistics"
import BackButton from "@/components/buttons/back-button.vue"
import { useStore } from "@/stores"

export default {
  components: {
    BackButton,
    DroitsDetails,
    DroitsContributions,
    Feedback,
    LoadingModal,
  },
  mixins: [ResultatsMixin, StatisticsMixin],
  setup() {
    return {
      store: useStore(),
    }
  },
  computed: {
    situation() {
      return this.store.situation
    },
    droit() {
      const droitId = this.$route.params.droitId
      const droit = (this.droits || []).find(function (droit) {
        return droit.id === droitId
      })
      return droit
    },
    patrimoineCaptured() {
      return this.store.hasPatrimoine !== undefined
    },
    ressourcesYearMinusTwoCaptured() {
      return this.store.ressourcesYearMinusTwoCaptured
    },
  },
  mounted() {
    if (this.mock(this.$route.params.droitId)) {
      return
    } else if (!this.droits) {
      this.restoreLatest()
    } else {
      const droitId = this.$route.params.droitId
      const droit = this.droits.find(function (droit) {
        return droit.id === droitId
      })

      droit && this.$matomo?.trackEvent("General", "showDetails", droit.id)

      this.sendStatistics({
        event: "showDetails",
        benefitId: droitId,
        benefits: this.droits,
      })
    }
  },
  methods: {
    goBack() {
      this.$router.push("/simulation/resultats")
    },
  },
}
</script>
