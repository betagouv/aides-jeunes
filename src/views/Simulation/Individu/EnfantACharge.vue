<template>
  <form @submit.prevent="onSubmit">
    <YesNoQuestion v-model="value">
      {{
        role === "demandeur"
          ? `Figurez-vous sur la dernière déclaration d'impôts de vos parents`
          : `${getLabel(
              "nom"
            )} figure-t-il/elle sur votre dernière déclaration d'impôts sur le revenu`
            | capitalize
      }}&nbsp;?
    </YesNoQuestion>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import YesNoQuestion from "@/components/YesNoQuestion"
import Individu from "@/lib/Individu"
import { createIndividuMixin } from "@/mixins/IndividuMixin"

export default {
  name: "SimulationIndividuEnfantACharge",
  components: {
    Actions,
    YesNoQuestion,
  },
  mixins: [createIndividuMixin("enfant_a_charge")],
  data: function () {
    const id = this.$route.params.id
    const role = id.split("_")[0]
    const { individu } = Individu.get(
      this.$store.getters.peopleParentsFirst,
      role,
      id,
      this.$store.state.dates
    )
    return {
      individu,
    }
  },
}
</script>
