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
        <WarningMessage v-if="store.message.text"
          ><div class="message" v-html="store.message.text"
        /></WarningMessage>
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
import WarningMessage from "@/components/warning-message"
import { useStore } from "@/stores"

export default {
  name: "Simulation",
  components: {
    WarningMessage,
    ProgressBar,
    TitreChapitre,
    Progress,
    Summary,
  },
  setup() {
    return {
      store: useStore(),
    }
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
      return this.store.getDebug
    },
  },
  methods: {
    disableDebug() {
      this.store.setDebug(false)
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
