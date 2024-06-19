<script setup lang="ts">
import { ref, computed } from "vue"
import StepView from "./step-view.vue"

const props = defineProps({
  step: {
    type: Object,
    required: true,
  },
  depth: Number,
})

const open = ref(false)
const totalSubSteps = computed(() => countSubSteps(props.step))
const nextStep = computed(() => getNextStep(props.step))
const isLeafNode = computed(() => totalSubSteps.value === 1)
const buttonLabel = computed(() =>
  isLeafNode.value ? " " : open.value ? "-" : "+"
)
const label = computed((): string => {
  const count = totalSubSteps.value
  return `${nextStep.value}${count > 1 ? `(+${count - 1})` : ""}`
})

const countSubSteps = (step): number => {
  if (step.steps) {
    const subStepCounts = step.steps.map(countSubSteps)
    return subStepCounts.reduce((total, count) => total + count, 0)
  }
  return 1
}

const getNextStep = (step): any => {
  return step.path || (step.steps ? getNextStep(step.steps[0]) : "")
}

const toggleOpen = () => {
  open.value = !open.value
}
</script>

<template>
  <div class="fr-my-1v">
    <button
      :disabled="isLeafNode"
      class="fr-btn fr-btn--secondary fr-grid-row--center aj-step-button"
      @click="toggleOpen"
    >
      {{ buttonLabel }}
    </button>
    <span
      :class="['fr-icon-question-line', { 'aj-hidden': !step?.isActive }]"
      aria-hidden="true"
    ></span>
    <span> {{ label }}</span>
    <div v-if="open">
      <StepView
        v-for="(substep, index) in step.steps"
        :key="index"
        :step="substep"
        class="fr-ml-3w"
      />
    </div>
  </div>
</template>
