<template>
  <form @submit.prevent="onSubmit">
    <fieldset class="fr-fieldset">
      <legend id="step-question" class="fr-fieldset__legend">
        À quel échelon {{ getLabel("être") }} boursier ?
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-container fr-px-0">
          <div class="fr-grid-row">
            <div class="fr-col-12 fr-col-md-8 fr-col-lg-8">
              <input
                id="bourse_criteres_sociaux_echelon"
                v-model="value"
                type="range"
                min="-1"
                max="7"
                aria-labelledby="step-question"
              />
            </div>
          </div>
        </div>
        <p>{{ value == -1 ? "Non boursier" : `Boursier échelon ${value}` }}</p>
      </div>
    </fieldset>
    <ActionButtons :on-submit="onSubmit" />
  </form>
</template>

<script>
import ActionButtons from "@/components/action-buttons.vue"
import { createIndividuMixin } from "@/mixins/individu-mixin"
import { useStore } from "@/stores"

export default {
  name: "SimulationIndividuBourseCriteresSociauxEchelon",
  components: {
    ActionButtons,
  },
  mixins: [createIndividuMixin("bourse_criteres_sociaux_echelon")],
  setup() {
    return {
      store: useStore(),
    }
  },
}
</script>
