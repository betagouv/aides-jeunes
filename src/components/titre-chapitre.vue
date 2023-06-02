<template>
  <div class="fr-container--fluid fr-px-0 fr-py-2w">
    <div
      v-if="shouldDisplayResults && hasDroits && showEmailButton"
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
            <SendRecapEmailButton
              data-testid="send-email-button"
              text="Recevoir les résultats par email"
            ></SendRecapEmailButton>
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="fr-grid-row">
      <div class="fr-col-12 fr-col-md-12 fr-col-lg-12">
        <h1 class="fr-my-0 fr-mx-0">{{ title }}</h1>
      </div>
    </div>
  </div>
</template>

<script>
import Chapters from "@lib/chapters.ts"
import SendRecapEmailButton from "@/components/buttons/send-recap-email-button.vue"
import { useStore } from "@/stores/index.ts"
import ResultatsMixin from "@/mixins/resultats.js"

export default {
  name: "TitreChapitre",
  components: { SendRecapEmailButton },
  mixins: [ResultatsMixin],
  setup() {
    return {
      store: useStore(),
    }
  },
  computed: {
    title() {
      return this.getTitleByRoute(this.$route)
    },
    showEmailButton() {
      return (
        this.store.recapEmailState !== "ok" && this.$route.name === "resultats"
      )
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
        return ""
      }

      const current = path.replace(/\/en_savoir_plus/, "")
      const step =
        this.store.passSanityCheck &&
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
