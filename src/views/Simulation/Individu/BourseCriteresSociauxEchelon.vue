<template>
  <form @submit.prevent="onSubmit">
    <label for="bourse_criteres_sociaux_echelon" class="aj-question"
      >À quel échelon {{ getLabel("être") }} boursier ?</label
    >
    <input
      id="bourse_criteres_sociaux_echelon"
      v-model="value"
      type="range"
      min="-1"
      max="7"
    />
    {{ value == -1 ? "Non boursier" : "Boursier échelon " + value }}
    <ActionButtons :on-submit="onSubmit" />
  </form>
</template>

<script>
import ActionButtons from "@/components/ActionButtons"
import { createIndividuMixin } from "@/mixins/individu-mixin"

export default {
  name: "SimulationIndividuBourseCriteresSociauxEchelon",
  components: {
    ActionButtons,
  },
  mixins: [createIndividuMixin("bourse_criteres_sociaux_echelon")],
}
</script>
