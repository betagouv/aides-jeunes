<template>
  <div class="aj-simulation">
    <div class="aj-complete-progress-bar" v-if="showProgress">
      <div :style="currentProgressStyle" />
    </div>
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
          <router-view v-bind:key="$route.path" />
        </div>
      </div>
      <Progress v-if="debug" />
    </div>
  </div>
</template>

<script>
import TitreChapitre from "@/components/TitreChapitre"
import Progress from "@/components/Progress"

export default {
  name: "Simulation",
  components: {
    TitreChapitre,
    Progress,
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
    showProgress() {
      return ![
        "recapitulatif",
        "resultats",
        "resultatsDetails",
        "resultatsAttendus",
      ].includes(this.$route.name)
    },
    currentProgressStyle() {
      return {
        width: `${this.$store.getters.progress * 100}%`,
      }
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
