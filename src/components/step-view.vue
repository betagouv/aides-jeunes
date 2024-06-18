<script setup lang="ts">
import { ref, computed } from "vue"
import StepView from "./step-view.vue"

const props = defineProps({
  step: Object,
  depth: Number,
})

const open = ref(false)
const itemCount = computed(() => counter(props.step))
const nextStep = computed(() => next(props.step))
const label = computed(() => {
  const count = itemCount.value
  return `${nextStep.value}${count > 1 ? `(+${count - 1})` : ""}`
})

const counter = (step) => {
  return step.steps ? step.steps.map(counter).reduce((a, v) => a + v, 0) : 1
}

const next = (step) => {
  return step.path || (step.steps ? next(step.steps[0]) : "GGG")
}

const toggle = () => {
  open.value = !open.value
}
</script>

<template>
  <div class="step">
    <button
      :disabled="itemCount == 1"
      class="fr-btn fr-btn--secondary"
      @click="toggle"
    >
      {{ itemCount == 1 ? "" : open ? "-" : "+" }}
    </button>
    <span
      :class="!step?.isActive && 'hidden'"
      class="fr-icon-question-line"
      aria-hidden="true"
    />
    {{ label }}

    <div v-if="open">
      <StepView
        v-for="(substep, index) in step?.steps"
        :key="index"
        :step="substep"
      />
    </div>
  </div>
</template>

<style type="text/css" scoped>
.step {
  padding-left: 1em;
}
button {
  min-width: 50px;
  justify-content: center;
}
.hidden {
  visibility: hidden;
}
</style>
