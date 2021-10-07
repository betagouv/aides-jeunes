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
      this.$route.params.id,
      this.$store.state.dates
    )
    const value = this.$store.getters.getAnswer(
      id,
      "individu",
      "enfant_a_charge"
    )
    return {
      individu,
      id,
      value,
      role,
    }
  },
  methods: {
    onSubmit: function () {
      if (this.requiredValueMissing()) {
        return
      }

      this.$store.dispatch("answer", {
        id: this.id,
        entityName: "individu",
        fieldName: "enfant_a_charge",
        value: this.value,
      })
      this.$push()
    },
  },
}
</script>
