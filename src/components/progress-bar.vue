<template>
  <div v-if="showProgress" class="aj-complete-progress-bar">
    <div :style="currentProgressStyle" />
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

const currentProgressStyle = computed(() => {
  return {
    width: `${progress.value * 100}%`,
  }
})
</script>
