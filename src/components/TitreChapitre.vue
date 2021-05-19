<template>
  <div>
    <div class="aj-category-title-wrapper">
      <h1>{{ title }}</h1>
    </div>
    <div
      class="aj-category-title-wrapper-mobile"
      :class="{ open: mobileOpen }"
      @click="switchMobileOpen"
    >
      <h1>{{ title }} <img src="@/assets/images/arrow-down.svg" /></h1>
    </div>
  </div>
</template>

<script>
import Chapters from "@/lib/Chapters"

export default {
  name: "TitreChapitre",
  computed: {
    title() {
      return this.getTitleByRoute(this.$route)
    },
    mobileOpen() {
      return this.$store.getters.getMobileMenu
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
      this.$store.commit("setMobileMenu", !this.$store.getters.getMobileMenu)
    },
  },
}
</script>

<style type="text/css"></style>
