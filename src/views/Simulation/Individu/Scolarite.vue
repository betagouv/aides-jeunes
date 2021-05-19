<template>
  <form @submit.prevent="onSubmit">
    <fieldset>
      <legend
        ><h2 class="aj-question">{{ question }}&nbsp;? </h2></legend
      >
      <div
        class="aj-selection-wrapper"
        v-for="scolarite in scolariteOptions"
        v-bind:key="scolarite.value"
      >
        <input
          :id="scolarite.value"
          type="radio"
          name="scolarite"
          v-bind:value="scolarite.value"
          v-model="value"
        />
        <label :for="scolarite.value">{{ scolarite.label }}</label>
      </div>
    </fieldset>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import { createIndividuMixin } from "@/mixins/IndividuMixin"
import Individu from "@/lib/Individu"

export default {
  name: "SimulationIndividuScolarite",
  components: {
    Actions,
  },
  data: function () {
    return {
      scolariteOptions: Individu.scolariteOptions,
    }
  },
  computed: {
    question: function () {
      return this.role == "demandeur"
        ? "Où êtes-vous scolarisé·e"
        : `Où sera scolarisé·e ${this.individu._firstName} à la rentrée prochaine`
    },
  },
  mixins: [createIndividuMixin("scolarite")],
}
</script>
