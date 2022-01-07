<template>
  <div class="aj-category-title-wrapper">
    <div class="aj-category-title">
      <h1>{{ title }}</h1>
      <div class="aj-category-title-button-mobile">
        <MenuButton
          v-show="showMenuButton"
          @click.native="goToRecapitulatifPage"
        ></MenuButton>
      </div>
    </div>
  </div>
</template>

<script>
import Chapters from "@/lib/chapters"
import MenuButton from "@/components/buttons/menu-button"

export default {
  name: "TitreChapitre",
  components: { MenuButton },
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
        this.$store.getters.passSanityCheck &&
        this.$state.current(current, this.$store.getters.getAllSteps)
      const chapterName = (step && step.chapter) || ""
      return Chapters.getLabel(chapterName)
    },
    goToRecapitulatifPage() {
      this.$router.push({ name: "recapitulatif" })
    },
  },
}
</script>

<style lang="scss"></style>
