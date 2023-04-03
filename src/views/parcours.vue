<template>
  <article class="fr-article">
    {{ steps.length }} - {{ s_counter(steps) }}
    <StepView v-for="(step, index) in steps" :key="index" :step="step" />
    <pre>
    {{ JSON.stringify(steps, null, 4) }}
    </pre>
  </article>
</template>

<script>
import { useStore } from "@/stores/index.ts"
import { generateBlocks } from "@/../lib/state/blocks.ts"
import StepView from "@/components/step-view.vue"

function counter(steps) {
  return steps
    .map((s) => (s.steps ? counter(s.steps) : 1))
    .reduce((a, v) => a + v, 0)
}

export default {
  name: "Parcours",
  components: {
    StepView,
  },
  setup() {
    return {
      store: useStore(),
      steps: generateBlocks({
        demandeur: { id: "demandeur" }, //*
        conjoint: { id: "conjoint" },
        enfants: [{ id: "enfant_0" }], //*/,
      }),
    }
  },
  methods: {
    s_counter(steps) {
      return counter(steps)
    },
  },
}
</script>
