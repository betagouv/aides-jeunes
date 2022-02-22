<template>
  <div v-if="showProgress" class="aj-complete-progress-bar">
    <div :style="currentProgressStyle" />
  </div>
</template>

<script>
import { isStepAnswered } from "../../lib/answers"

export default {
  name: "ProgressBar",
  data() {
    return {
      window,
    }
  },
  computed: {
    showProgress() {
      return "resultatsAttendus" !== this.$route.name
    },
    progress() {
      const cleanPath = this.$route.path.replace(/\/en_savoir_plus$/, "")
      const allSteps = this.$store.getters.getAllSteps.filter(
        (step) => !["/", "/simulation/resultats"].includes(step.path)
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
