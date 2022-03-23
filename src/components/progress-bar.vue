<template>
  <div v-if="showProgress" class="aj-complete-progress-bar">
    <div :style="currentProgressStyle" />
  </div>
</template>

<script>
import ProgressMixin from "@/mixins/progress-mixin"

export default {
  name: "ProgressBar",
  mixins: [ProgressMixin],
  data() {
    return {
      window,
    }
  },
  computed: {
    showProgress() {
      return "resultatsAttendus" !== this.$route.name
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
