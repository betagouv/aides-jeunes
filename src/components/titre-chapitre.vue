<template>
  <div class="fr-container--fluid fr-px-0 fr-mt-3w fr-py-2w">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-hidden-md fr-col-1 fr-mr-2w">
        <MenuButton
          v-show="showMenuButton"
          @click="goToRecapitulatifPage"
        ></MenuButton>
      </div>
      <div class="fr-col">
        <h1 class="fr-my-0">{{ title }}</h1>
      </div>
      <div
        v-if="shouldDisplayResults && hasDroits"
        class="fr-col-12 fr-col-md-6 fr-col-lg-5"
      >
        <ul class="fr-btns-group fr-btns-group--right fr-mt-1w">
          <li>
            <SendRecapEmailButton
              text="Recevoir les résultats par email"
            ></SendRecapEmailButton>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Chapters from "@lib/chapters"
import MenuButton from "@/components/buttons/menu-button.vue"
import SendRecapEmailButton from "@/components/buttons/send-recap-email-button.vue"
import { useStore } from "@/stores"
import ResultatsMixin from "@/mixins/resultats"

export default {
  name: "TitreChapitre",
  components: { SendRecapEmailButton, MenuButton },
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
    showMenuButton() {
      return this.$route.name !== "recapitulatif"
    },
  },
  methods: {
    getTitleByRoute(route) {
      const path = route.path
      if (path === "/simulation/recapitulatif") {
        return "Récapitulatif"
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

<style lang="scss"></style>
