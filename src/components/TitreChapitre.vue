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
      const step = this.$state.current(route.path, this.$store.state.situation)
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
