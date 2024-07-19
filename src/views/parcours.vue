<script setup lang="ts">
import { ref, computed, ComputedRef } from "vue"
import { generateBlocks } from "@lib/state/blocks.js"
import StepView from "@/components/step-view.vue"
import { Block } from "@lib/types/blocks"

const conjoint = ref(false)
const enfants = ref(false)

const blocks: ComputedRef<Block[]> = computed(() => {
  return generateBlocks({
    demandeur: { id: "demandeur" },
    conjoint: conjoint.value ? { id: "conjoint" } : undefined,
    enfants: enfants.value
      ? [{ id: "enfant_0", enfant_a_charge: {} }]
      : undefined,
  })
})

function recursiveStepCounter(steps): number {
  return steps.reduce((total, step) => {
    return total + (step.steps ? recursiveStepCounter(step.steps) : 1)
  }, 0)
}

const totalSteps = computed(() => recursiveStepCounter(blocks.value))
</script>

<template>
  <article class="fr-article">
    <h1>Détails du parcours</h1>
    <h2>Informations</h2>
    <div class="fr-ml-1w">
      <div class="fr-my-1w">
        {{ blocks.length }} blocs de premier niveau - {{ totalSteps }} étapes au
        total
      </div>
      <div class="fr-mb-1w">
        <span class="fr-icon-arrow-right-s-line fr-my-1w" aria-hidden="true" />
        Indique une question avec au moins une sous-question (→ noeud
        interactif).
      </div>
      <div>
        <span class="fr-icon-leaf-line fr-my-1w" aria-hidden="true" />
        Indique une question sans sous-questions (→ feuille).
      </div>
      <div>
        <span class="fr-icon-question-line fr-my-1w" aria-hidden="true" />
        Indique une question affichée de façon conditionnelle.
      </div>
      <div class="fr-checkbox-group fr-my-1w">
        <input
          id="conjoint"
          v-model="conjoint"
          type="checkbox"
          value="conjoint"
        />
        <label for="conjoint" class="fr-label">
          Ajouter les questions lorsqu'on est en couple.
        </label>
      </div>
      <div class="fr-checkbox-group fr-my-1w">
        <input id="enfants" v-model="enfants" type="checkbox" value="enfants" />
        <label for="enfants" class="fr-label"
          >Ajouter les questions lorsqu'il y a un enfant dans la famille.
        </label>
      </div>
    </div>
    <h2>Étapes</h2>
    <div class="fr-ml-1w">
      <StepView
        v-for="(block, index) in blocks"
        :key="`block-${index}`"
        :step="block"
      />
    </div>
  </article>
</template>
