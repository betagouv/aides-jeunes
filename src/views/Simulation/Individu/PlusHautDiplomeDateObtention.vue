<template>
  <form @submit.prevent="onSubmit">
    <h2 class="aj-question"
      >Quand {{ getLabel("avoir") }} obtenu votre plus haut diplôme ?
      (approximativement)</h2
    >
    <InputDate required id="plus_haut_diplome_date_obtention" v-model="value" />
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import InputDate from "@/components/InputDate"
import { createIndividuMixin } from "@/mixins/IndividuMixin"

export default {
  name: "SimulationIndividuPlusHautDiplomeDateObtention",
  components: {
    Actions,
    InputDate,
  },
  mixins: [createIndividuMixin("plus_haut_diplome_date_obtention")],
}
</script>
