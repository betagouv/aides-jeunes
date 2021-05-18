<template>
  <form @submit.prevent="onSubmit">
    <fieldset>
      <legend
        ><h2 class="aj-question">{{
          role === "demandeur"
            ? "Quelle est votre nationalité&nbsp;?"
            : `Quelle est la nationalité ${getLabel("préposition")}${getLabel(
                "nom"
              )}&nbsp;?`
        }}</h2></legend
      >
      <NationalityChoice v-model="value" @update="onSubmit" />
    </fieldset>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import NationalityChoice from "@/components/NationalityChoice"
import { createIndividuMixin } from "@/mixins/IndividuMixin"

export default {
  name: "SimulationIndividuNationalite",
  components: {
    Actions,
    NationalityChoice,
  },
  mixins: [createIndividuMixin("nationalite")],
}
</script>
