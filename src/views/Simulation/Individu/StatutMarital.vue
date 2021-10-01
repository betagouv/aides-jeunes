<template>
  <form @submit.prevent="onSubmit">
    <fieldset>
      <legend
        ><h2 class="aj-question"
          >Quelle est votre relation avec votre conjoint&nbsp;?
        </h2></legend
      >
      <div
        class="aj-selection-wrapper"
        v-for="situationFamiliale in situationsFamiliales"
        v-bind:key="situationFamiliale.value"
      >
        <input
          :id="situationFamiliale.value"
          type="radio"
          name="situationFamiliale"
          v-bind:value="situationFamiliale.value"
          v-model="value"
        />
        <label :for="situationFamiliale.value">{{
          situationFamiliale.label
        }}</label>
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
  name: "SimulationIndividuStatutMarital",
  components: {
    Actions,
  },
  mixins: [createIndividuMixin("statut_marital")],
  data: function () {
    return {
      situationsFamiliales: Individu.situationsFamiliales,
    }
  },
  methods: {
    onSubmit: function () {
      this.$store.dispatch("answer", {
        id: "conjoint",
        entityName: "individu",
        fieldName: "statut_marital",
        value: this.value,
      })
      this.$push()
    },
  },
}
</script>
