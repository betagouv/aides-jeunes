<template>
  <div>
    <div class="aj-category-title-wrapper">
      <h1>{{ title }}</h1>
    </div>
    <div
      class="aj-category-title-wrapper-mobile"
      :class="{ 'has-menu-button': hasMenuButton }"
    >
      <MenuButton
        @click.native="switchMobileOpen"
        v-show="hasMenuButton"
      ></MenuButton>
      <h1>{{ title }}</h1>
    </div>
  </div>
</template>

<script>
import Chapters from "@/lib/Chapters"
import MenuButton from "@/components/Buttons/MenuButton"

export default {
  name: "TitreChapitre",
  components: { MenuButton },
  computed: {
    title() {
      return this.getTitleByRoute(this.$route)
    },
    hasMenuButton() {
      return this.$route.name !== "sommaire"
    },
  },
  methods: {
    getTitleByRoute(route) {
      const path = route.path
      const current = path.replace(/\/en_savoir_plus/, "")
      const step =
        this.$store.getters.passSanityCheck &&
        this.$state.current(current, this.$store.getters.getAllSteps)
      const chapterName = (step && step.chapter) || ""
      return Chapters.getLabel(chapterName)
    },
    switchMobileOpen() {
      this.$router.push({ path: this.$route.path + "/sommaire" })
    },
  },
}
</script>

<style lang="scss"></style>
