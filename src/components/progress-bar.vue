<template>
  <div v-if="showProgress" class="aj-progress-bar-container">
    <label for="progress-bar" class="fr-sr-only"
      >Avancement du questionnaire de simulation :
      {{ currentProgress.width }}</label
    >
    <div class="aj-progress-bar-background">
      <div
        role="progressbar"
        id="progress-bar"
        max="100"
        :style="currentProgress"
        class="aj-progress-bar-foreground"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ComputedRef } from "vue"
import { useRoute } from "vue-router"
import { useProgress } from "@/composables/progress"

const route = useRoute()
const progress: ComputedRef<number> = useProgress()

const showProgress = computed(() => {
  return "resultatsAttendus" !== route.name
})

const currentProgress = computed(() => {
  return { width: `${progress.value * 100}%` }
})
</script>
