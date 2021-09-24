<template>
  <div>
    <div class="aj-category-title-wrapper">
      <h1>{{ title }}</h1>
    </div>
    <div
      class="aj-category-title-wrapper-mobile"
      :class="{ 'has-menu-button': showMenuButton }"
    >
      <MenuButton
        @click.native="goToSummaryPage"
        v-show="showMenuButton"
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
    showMenuButton() {
      return this.$route.name !== "sommaire"
    },
  },
  methods: {
    getTitleByRoute(route) {
      const step = this.$state.current(route.path, this.$store.state.situation)
      const chapterName = (step && step.chapter) || ""
      return Chapters.getLabel(chapterName)
    },
    goToSummaryPage() {
      this.$router.push({ path: this.$route.path + "/sommaire" })
    },
  },
}
</script>

<style lang="scss"></style>
