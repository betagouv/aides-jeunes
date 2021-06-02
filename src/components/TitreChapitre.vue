<template>
  <div class="aj-category-title-wrapper">
    <h1 tabindex="0">{{ title }}</h1>
  </div>
</template>

<script>
export default {
  name: "TitreChapitre",
  computed: {
    title() {
      return this.getTitleByRoute(this.$route, this.$store.state.situation)
    },
  },
  methods: {
    getTitleByRoute(route, situation) {
      const path = route.path
      const current = path.replace(/\/en_savoir_plus/, "")
      const step =
        this.$store.getters.passSanityCheck &&
        this.$state.current(current, situation)
      const chapter = (step && step.chapter) || ""
      switch (chapter) {
        case "profil":
          return "Mon profil"
        case "foyer":
          return "Mon foyer"
        case "logement":
          return "Mon logement"
        case "revenus":
          return "Mes revenus"
        case "projets":
          return "Mes projets"
        case "resultats":
          return "Mes résultats"
        default:
          return "Ma simulation"
      }
    },
  },
}
</script>

<style type="text/css"></style>
