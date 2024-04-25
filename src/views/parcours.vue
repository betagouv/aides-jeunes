<template>
  <article class="fr-article">
    <h1>Détails du parcours</h1>
    <h2>Informations</h2>
    <div>
      <div>
        {{ steps.length }} blocs de premier niveau -
        {{ s_counter(steps) }} étapes au total
      </div>
      <div>
        <span class="fr-icon-question-line" aria-hidden="true" />
        indique une question affichée de façon conditionnelle.
      </div>
      <div class="fr-checkbox-group">
        <input
          id="conjoint"
          v-model="conjoint"
          type="checkbox"
          checked="true"
          value="conjoint"
        />
        <label for="conjoint" class="fr-label">
          Ajouter les questions lorsque que la personne est en couple.
        </label>
      </div>
      <div class="fr-checkbox-group">
        <input
          id="enfants"
          v-model="enfants"
          type="checkbox"
          checked="true"
          value="enfants"
        />
        <label for="enfants" class="fr-label"
          >Ajouter les questions lorsque qu'il y a un enfant dans la famille.
        </label>
      </div>
    </div>
    <h2>Étapes</h2>
    <div>
      <StepView v-for="step in steps" :key="step" :step="step" />
    </div>
  </article>
</template>

<script>
import { ref } from "vue"
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
      conjoint: ref(false),
      enfants: ref(false),
    }
  },
  computed: {
    steps() {
      return generateBlocks({
        demandeur: { id: "demandeur" },
        conjoint: this.conjoint ? { id: "conjoint" } : undefined,
        enfants: this.enfants
          ? [{ id: "enfant_0", enfant_a_charge: {} }]
          : undefined,
      })
    },
  },
  methods: {
    s_counter(steps) {
      return counter(steps)
    },
  },
}
</script>
