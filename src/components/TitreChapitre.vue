<template>
  <div>
    <div class="aj-category-title-wrapper">
      <h1>{{ title }}</h1>
    </div>
    <div class="aj-category-title-wrapper-mobile">
      <MenuButton
        @click.native="switchMobileOpen"
        v-show="$route.name !== 'sommaire'"
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
