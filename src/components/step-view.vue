<template>
  <div class="step">
    <button
      :disabled="item_count == 1"
      @click="toggle()"
      class="fr-btn fr-btn--secondary"
    >
      {{ item_count == 1 ? "" : open ? "-" : "+" }}
    </button>
    <span
      :class="!step.isActive && 'hidden'"
      class="fr-icon-question-line"
      aria-hidden="true"
    />
    {{ label(step) }}

    <StepView
      v-if="open"
      v-for="(step, index) in step.steps"
      :key="index"
      :step="step"
    />
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
  setup(props) {
    return {
      step: props.step,
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
    label(s) {
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
