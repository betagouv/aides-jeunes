<template>
  <div class="step">
    <button
      :disabled="item_count == 1"
      class="fr-btn fr-btn--secondary"
      @click="toggle()"
    >
      {{ item_count == 1 ? "" : open ? "-" : "+" }}
    </button>
    <span
      :class="!step.isActive && 'hidden'"
      class="fr-icon-question-line"
      aria-hidden="true"
    />
    {{ label(step) }}

    <div v-if="open">
      <StepView
        v-for="(substep, index) in step.steps"
        :key="index"
        :step="substep"
      />
    </div>
  </div>
</template>

<script>
import { ref } from "vue"

function counter({ steps }) {
  return steps ? steps.map(counter).reduce((a, v) => a + v, 0) : 1
}

function next(step) {
  return step.path || (step.steps ? next(step.steps[0]) : "GGG")
}

export default {
  name: "StepView",
  props: {
    step: Object,
    depth: Number,
  },
  setup() {
    return {
      open: ref(false),
    }
  },
  computed: {
    item_count() {
      return counter(this.step)
    },
    next() {
      return next(this.step)
    },
  },
  methods: {
    toggle() {
      this.open = !this.open
    },
    label() {
      const count = this.item_count
      return `${this.next}${count > 1 ? `(+${count - 1})` : ""}`
    },
  },
}
</script>

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
