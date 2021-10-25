<template>
  <form @submit.prevent="onSubmit">
    <fieldset>
      <legend>
        <h2 class="aj-question">
          <span
            >{{
              isDemandeur
                ? `Avez-vous fait votre propre déclaration d'impôts`
                : `${getLabel(
                    "nom"
                  )} figure-t-il/elle sur votre dernière déclaration d'impôts sur le revenu`
                  | capitalize
            }}&nbsp;?</span
          >
        </h2>
      </legend>
      <div class="aj-selections">
        <div class="aj-selection-wrapper">
          <input
            id="true"
            type="radio"
            name="enfant_a_charge"
            :value="!isDemandeur"
            v-model="value"
            autofocus
          />
          <label for="true"> Oui </label>
        </div>
        <div class="aj-selection-wrapper">
          <input
            id="false"
            type="radio"
            name="enfant_a_charge"
            :value="isDemandeur"
            v-model="value"
            autofocus
          />
          <label for="false"> Non </label>
        </div>
      </div>
    </fieldset>
    <Actions v-bind:onSubmit="onSubmit" />
  </form>
</template>

<script>
import Actions from "@/components/Actions"
import Individu from "@/lib/Individu"
import { createIndividuMixin } from "@/mixins/IndividuMixin"

export default {
  name: "SimulationIndividuEnfantACharge",
  components: {
    Actions,
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
    const isDemandeur = role === "demandeur"

    return {
      individu,
      isDemandeur,
    }
  },
}
</script>
