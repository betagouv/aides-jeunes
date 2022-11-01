<template>
  <div class="aj-category-title-wrapper">
    <div class="aj-category-title">
      <h1>{{ title }}</h1>
      <div class="aj-category-title-button-mobile">
        <MenuButton
          v-show="showMenuButton"
          @click="goToRecapitulatifPage"
        ></MenuButton>
      </div>
    </div>
    <SendRecapEmailButton
      v-if="shouldDisplayResults && hasDroits"
      class="recap-email-button outline"
      text="Recevoir les résultats par email"
    ></SendRecapEmailButton>
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
      } else if (path === "/simulation/individu/demandeur/date_naissance") {
        return "Mon profil"
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
