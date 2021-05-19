<template>
  <form @submit.prevent="onSubmit">
    <h2 class="aj-question"
      >{{ getLabel("avoir") | capitalize }} besoin d’une aide à la
      personne&nbsp;?</h2
    >
    <div
      class="aj-selection-wrapper"
      v-for="gir in GIROptions"
      v-bind:key="gir.value"
    >
      <input
        :id="gir.value"
        type="radio"
        name="gir"
        v-bind:value="gir.value"
        v-model="value"
      />
      <label :for="gir.value">
        {{ gir.label }}
      </label>
    </div>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import { createIndividuMixin } from "@/mixins/IndividuMixin"

const GIROptions = [
  {
    value: "gir_6",
    label: "Jamais",
  },
  {
    value: "gir_5",
    label: "Ponctuellement",
  },
  {
    value: "gir_1",
    label: "Régulièrement",
  },
]

export default {
  name: "SimulationIndividuGir",
  components: {
    Actions,
  },
  mixins: [createIndividuMixin("gir")],
  data: function () {
    return {
      GIROptions,
    }
  },
}
</script>
