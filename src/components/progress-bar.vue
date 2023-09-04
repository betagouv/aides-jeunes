<template>
  <div v-if="showProgress" class="aj-progress-bar-container">
    <p id="progress-bar-description" class="fr-sr-only"
      >Avancement du questionnaire de simulation :
      {{ (progress * 100).toFixed(2) }}%</p
    >
    <div class="aj-progress-bar-background">
      <div
        role="progressbar"
        aria-labelledby="progress-bar-description"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="progress * 100"
        :style="currentProgress"
        class="aj-progress-bar-foreground"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ComputedRef } from "vue"
import { useRoute } from "vue-router"
import { useProgress } from "@/composables/progress.js"

const route = useRoute()
const progress: ComputedRef<number> = useProgress()

const showProgress = computed(() => {
  return "resultatsAttendus" !== route.name
})

const currentProgress = computed(() => {
  return { width: `${progress.value * 100}%` }
})
</script>
