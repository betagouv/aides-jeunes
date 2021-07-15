<template>
  <form @submit.prevent="onSubmit">
    <label for="contrat_de_travail_debut"
      ><h2 class="aj-question">
        {{
          individu.alternant
            ? "Quand avez-vous commencé votre alternance ?"
            : "Quand avez-vous commencé votre contrat de travail ?"
        }}
      </h2></label
    >
    <InputDate required id="contrat_de_travail_debut" v-model="value" />
    <p class="notification warning" v-if="error"> Ce champ est obligatoire. </p>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import InputDate from "@/components/InputDate"
import { createIndividuMixin } from "@/mixins/IndividuMixin"

export default {
  name: "SimulationContratDeTravailDebut",
  components: {
    Actions,
    InputDate,
  },
  mixins: [createIndividuMixin("contrat_de_travail_debut")],
}
</script>
