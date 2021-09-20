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

    <template v-if="isRelevantQuestionForContribution()">
      <ContributionForm
        v-model="contribution[entityName].enfant_a_charge"
      ></ContributionForm>
    </template>

    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import YesNoQuestion from "@/components/YesNoQuestion"
import Individu from "@/lib/Individu"
import { createIndividuMixin } from "@/mixins/IndividuMixin"
import { createContributionMixin } from "@/mixins/ContributionMixin"
import ContributionForm from "@/components/ContributionForm"

export default {
  name: "SimulationIndividuEnfantACharge",
  components: {
    Actions,
    YesNoQuestion,
    ContributionForm,
  },
  mixins: [createIndividuMixin("enfant_a_charge"), createContributionMixin()],
  data: function () {
    const params = this.$route.params
    const id = params.id
    const role = id.split("_")[0]
    const { individu } = Individu.get(
      this.$store.getters.peopleParentsFirst,
      role,
      params.id,
      this.$store.state.dates
    )
    const value =
      individu["enfant_a_charge"][this.$store.state.dates.thisYear.id]
    const contribution = this.initContribution(id)

    return {
      individu,
      id,
      value,
      role,
      contribution,
    }
  },
  computed: {
    entityName: function () {
      return this.$route.params.id
    },
  },
  methods: {
    onSubmit: function () {
      if (
        this.needCheckContrib(this.entityName, "enfant_a_charge") &&
        this.requiredValueMissing()
      ) {
        return
      }
      this.individu["enfant_a_charge"][this.$store.state.dates.thisYear.id] =
        this.value
      this.$store.dispatch("updateIndividu", this.individu)
      this.saveContribution(this.entityName, "enfant_a_charge")
      this.$push()
    },
  },
}
</script>
