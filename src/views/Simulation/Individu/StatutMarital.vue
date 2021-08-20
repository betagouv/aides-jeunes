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

    <template v-if="isRelevantQuestionForContribution('statut_marital')">
      <ContributionForm
        v-model="contribution[entityName].statut_marital"
      ></ContributionForm>
    </template>

    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import { createIndividuMixin } from "@/mixins/IndividuMixin"
import ContributionForm from "@/components/ContributionForm"
import { createContributionMixin } from "@/mixins/ContributionMixin"

const situationsFamiliales = [
  {
    value: "marie", // Enum value 1 in OpenFisca
    label: "Marié·e",
  },
  {
    value: "pacse", // Enum value 5 in OpenFisca
    label: "Pacsé·e",
  },
  {
    value: "celibataire", // Enum value 2 in OpenFisca
    label: "En union libre",
  },
]

export default {
  name: "SimulationIndividuStatutMarital",
  components: {
    Actions,
    ContributionForm,
  },
  mixins: [createIndividuMixin("statut_marital"), createContributionMixin()],
  data: function () {
    const contribution = this.initContribution(
      this.$route.params.id,
      "statut_marital"
    )
    return {
      situationsFamiliales,
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
        this.needCheckContrib(this.entityName, "statut_marital") &&
        this.requiredValueMissing()
      ) {
        return
      }
      this.individu[this.fieldName] = this.value
      this.$store.dispatch("updateIndividu", this.individu)
      this.$store.dispatch(
        "updateIndividu",
        Object.assign({}, this.$store.state.situation.demandeur, {
          [this.fieldName]: this.value,
        })
      )
      this.saveContribution(this.entityName, "statut_marital")
      this.$push()
    },
  },
}
</script>
