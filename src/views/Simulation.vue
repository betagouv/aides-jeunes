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
        <div
          v-if="debug"
          class="aj-debug-switch"
        >
          <button
            class="button small"
            @click="disableDebug"
          >
            Quitter le mode debug
          </button>
        </div>
        <div
          v-if="$store.state.message.text"
          class="notification warning"
        >
          <div
            class="message"
            v-html="$store.state.message.text"
          />
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
import TitreChapitre from "@/components/TitreChapitre"
import Progress from "@/components/Progress"
import Summary from "@/components/Summary"
import { isStepAnswered } from "../../lib/answers"

export default {
  name: "Simulation",
  components: {
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
    showProgress() {
      return "resultatsAttendus" !== this.$route.name
    },
    progress() {
      const cleanPath = this.$route.path.replace(/\/en_savoir_plus$/, "")
      const allSteps = this.$store.getters.getAllSteps.filter(
        (step) => step.path !== "/" && step.path !== "/simulation/resultats"
      )
      const activeSteps = allSteps.filter((step) => step.isActive)

      // Use anwers as basis when you are not in journey
      if (!allSteps.some((step) => step.path === cleanPath)) {
        const answeredSteps = activeSteps.filter((step) =>
          isStepAnswered(this.$store.state.answers.all, step)
        )
        return answeredSteps.length / activeSteps.length
      } else {
        const stepIndex = allSteps.findIndex((item) => item.path === cleanPath)
        const previousStep = allSteps
          .slice(0, stepIndex)
          .filter((step) => step.isActive)

        return previousStep.length / activeSteps.length
      }
    },
    currentProgressStyle() {
      return {
        width: `${this.progress * 100}%`,
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
