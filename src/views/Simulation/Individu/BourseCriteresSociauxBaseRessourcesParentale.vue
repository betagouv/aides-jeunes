<template>
  <form @submit.prevent="onSubmit">
    <fieldset>
      <legend>
        <h2 class="aj-question"
          >Quel est le revenu brut global 2019 figurant sur l’avis fiscal 2020
          de vos parents&nbsp;?
        </h2>
        <!-- We only display this button if the parents are divided -->
        <EnSavoirPlus v-if="isSepares" />
      </legend>

      <label>
        <input type="number" v-select-on-click v-model.number="value" />
      </label>
    </fieldset>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import { createIndividuMixin } from "@/mixins/IndividuMixin"
import EnSavoirPlus from "@/components/EnSavoirPlus"
export default {
  name: "SimulationIndividuBourseCriteresSociauxBaseRessourcesParentale",
  components: {
    Actions,
    EnSavoirPlus,
  },
  mixins: [
    createIndividuMixin("bourse_criteres_sociaux_base_ressources_parentale"),
  ],
  computed: {
    isSepares() {
      return this.$store.state.situation.parents._situation === "separes"
    },
  },
}
</script>
