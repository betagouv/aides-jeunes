<template>
  <div class="fr-container--fluid fr-px-0 fr-py-2w">
    <div
      v-if="shouldDisplayResults && hasBenefits && showEmailButton"
      class="fr-grid-row"
    >
      <div class="fr-col-12 fr-col-md-6 fr-col-lg-6">
        <h1 class="fr-my-0 fr-mx-0">{{ title }}</h1>
      </div>
      <div class="fr-col-12 fr-col-md-6 fr-col-lg-6">
        <ul
          class="fr-btns-group fr-btns-group--inline-md fr-btns-group--right fr-mt-1w fr-px-0"
        >
          <li>
            <SendRecapButton
              data-testid="send-email-and-sms-button"
              :text="emailButtonTitle"
            ></SendRecapButton>
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="fr-grid-row">
      <div class="fr-col-12 fr-col-sm-6">
        <h1 class="fr-my-0 fr-mx-0">{{ title }}</h1>
      </div>
      <div class="fr-col-12 fr-col-sm-6 aj-jedonnemonavis">
        <JeDonneMonAvis />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Chapters from "@lib/chapters.js"
import SendRecapButton from "@/components/buttons/send-recap-button.vue"
import { useStore } from "@/stores/index.js"
import { useResultsStore } from "@/stores/results-store.js"
import JeDonneMonAvis from "@/components/je-donne-mon-avis.vue"

export default {
  name: "TitreChapitre",
  components: { SendRecapButton, JeDonneMonAvis },
  setup() {
    return {
      store: useStore(),
      resultsStore: useResultsStore(),
    }
  },
  computed: {
    hasBenefits() {
      return this.resultsStore.hasBenefits
    },
    shouldDisplayResults() {
      return this.resultsStore.shouldDisplayResults
    },
    title() {
      return this.getTitleByRoute(this.$route)
    },
    showEmailButton() {
      return (
        this.$route.name === "resultats" && !this.store.simulationAnonymized
      )
    },
    emailButtonTitle() {
      return process.env.VITE_SHOW_SMS_TAB
        ? "Recevoir les résultats par email/SMS"
        : "Recevoir les résultats par email"
    },
    emailModalTitle() {
      return process.env.VITE_SHOW_SMS_TAB
        ? "Recevoir un récapitulatif"
        : "Recevoir un récapitulatif par email"
    },
  },
  methods: {
    getTitleByRoute(route) {
      const path = route.path
      if (path === "/simulation/recapitulatif") {
        return "Récapitulatif"
      }
      if (path.includes("simulation/resultat/inattendu/")) {
        return "Montant inattendu"
      }
      if (path === "/simulation/resultats/recapitulatif_email") {
        return this.emailModalTitle
      }

      const current = path.replace(/\/en_savoir_plus/, "")
      const step =
        (this.store.passSanityCheck || this.store.simulationAnonymized) &&
        this.$state.current(current, this.store.getAllSteps)
      const chapterName = step?.chapter || ""
      return Chapters.getLabel(chapterName)
    },
    goToRecapitulatifPage() {
      this.$router.push({ name: "recapitulatif" })
    },
  },
}
</script>
