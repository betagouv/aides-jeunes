<template>
  <div>
    <LoadingModal v-if="accessStatus.fetching || resultatStatus.updating">
      <p v-show="accessStatus.fetching">
        <span
          class="fr-icon--ml fr-icon-refresh-line fr-icon-spin"
          aria-hidden="true"
        ></span
        ><span class="fr-ml-2w">Récupération en cours…</span>
      </p>
      <p v-show="resultatStatus.updating">
        <span
          class="fr-icon--ml fr-icon-refresh-line fr-icon-spin"
          aria-hidden="true"
        ></span
        ><span class="fr-ml-2w">Récupération de vos droits…</span>
      </p>
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

<script lang="ts">
import DroitsDetails from "../../components/droits-details.vue"
import DroitsContributions from "../../components/droits-contributions.vue"
import Feedback from "@/components/feedback.vue"
import LoadingModal from "@/components/loading-modal.vue"
import ResultatsMixin from "@/mixins/resultats.js"
import StatisticsMixin from "@/mixins/statistics.js"
import BackButton from "@/components/buttons/back-button.vue"
import { useStore } from "@/stores/index.js"
import { EventAction } from "@lib/enums/event.js"

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
    benefit() {
      const benefitId = this.$route.params.benefitId
      const benefit = (this.benefits || []).find(function (benefit) {
        return benefit.id === benefitId
      })
      return benefit
    },
    ressourcesYearMinusTwoCaptured() {
      return this.store.ressourcesYearMinusTwoCaptured
    },
  },
  async mounted() {
    if (this.mockResultsNeeded()) {
      this.mock(this.$route.params.benefitId)
      return
    } else if (!this.benefits) {
      await this.restoreLatest()
    } else {
      const benefitId = this.$route.params.benefitId

      this.sendBenefitsStatistics(
        this.benefits,
        EventAction.ShowDetails,
        benefitId
      )
    }
  },
  methods: {
    goBack() {
      this.$router.push("/simulation/resultats")
    },
  },
}
</script>
