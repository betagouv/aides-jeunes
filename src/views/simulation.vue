<template>
  <div class="aj-simulation">
    <ProgressBar></ProgressBar>
    <div
      class="container aj-layout-container"
      :class="{ 'aj-debug-container': debug }"
    >
      <div class="aj-main-container">
        <TitreChapitre />
        <div v-if="debug" class="aj-debug-switch">
          <button class="button small" @click="disableDebug"
            >Quitter le mode debug</button
          >
        </div>
        <div v-if="$store.state.message.text" class="notification warning">
          <div class="message" v-html="$store.state.message.text" />
        </div>
        <div class="aj-box-wrapper">
          <router-view :key="$route.path" />
        </div>
      </div>
      <Progress v-if="debug" />
      <Summary v-else />
    </div>
  </div>
</template>

<script>
import TitreChapitre from "@/components/titre-chapitre"
import Progress from "@/components/progress"
import Summary from "@/components/summary"
import ProgressBar from "@/components/progress-bar"

export default {
  name: "Simulation",
  components: {
    ProgressBar,
    TitreChapitre,
    Progress,
    Summary,
  },
  data() {
    return {
      window,
    }
  },
  computed: {
    showSummary() {
      return this.$route.path !== "/simulation/recapitulatif"
    },
    debug() {
      return this.$store.getters.getDebug
    },
  },
  methods: {
    disableDebug() {
      this.$store.dispatch("setDebug", false)
      this.$router.replace({ debug: null })
    },
  },
}
</script>

<style type="text/css" scoped>
/* Hack for dev */
/*.container {*/
/*max-width: 100%;*/
/*display: flex;*/
/*}*/
</style>
