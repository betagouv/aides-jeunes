<template>
  <form @submit.prevent="onSubmit">
    <fieldset>
      <legend
        ><h2 class="aj-question"
          >Dans quel type d'établissement étudiez-vous actuellement&nbsp;?
        </h2></legend
      >
      <div
        class="aj-selection-wrapper"
        v-for="statuts in StatutsOptions"
        v-bind:key="statuts.value"
      >
        <input
          :id="statuts.value"
          type="radio"
          name="statuts"
          v-bind:value="statuts.value"
          v-model="value"
        />
        <label :for="statuts.value">{{ statuts.label }}</label>
      </div>
    </fieldset>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import { createIndividuMixin } from "@/mixins/IndividuMixin"

export default {
  name: "SimulationIndividuClassScolarite",
  components: {
    Actions,
  },
  computed: {
    StatutsOptions: function () {
      return [
        {
          value: "public",
          label: "Établissement public",
        },
        {
          value: "prive_sous_contrat",
          label: "Établissement privé sous contrat",
        },
        {
          value: "prive_hors_contrat",
          label: "Établissement privé hors contrat",
        },
        {
          value: "inconnu",
          label: "Autre",
        },
      ]
    },
  },
  mixins: [createIndividuMixin("statuts_etablissement_scolaire")],
}
</script>
