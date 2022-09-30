<template>
  <div>
    <form @submit.prevent="onSubmit">
      <fieldset>
        <legend>
          <h2 class="aj-question">
            {{ locataireTypesQuestion.label }}
          </h2>
        </legend>
        <div class="aj-selections">
          <div
            v-for="logementType in locataireTypesQuestion.responses"
            :key="logementType.value"
            class="aj-selection-wrapper"
          >
            <input
              :id="logementType.value"
              v-model="locataireTypesQuestion.selectedValue"
              type="radio"
              name="logementType"
              :value="logementType.value"
            />
            <label :for="logementType.value">
              {{ $filters.capitalize(logementType.label) }}
              <span v-if="logementType.hint" class="help">{{
                logementType.hint
              }}</span>
            </label>
          </div>
        </div>
      </fieldset>
      <ActionButtons :on-submit="onSubmit" :disableSubmit="!canSubmit(false)" />
    </form>
  </div>
</template>


<script>
import ActionButtons from "@/components/action-buttons.vue"
import Logement from "@lib/logement"
import { useStore } from "@/stores"
import { getAnswer } from "@lib/answers"

export default {
  components: {
    ActionButtons,
  },
  setup() {
    return {
      store: useStore(),
    }
  },
  data() {
    const logementStatut = getAnswer(
      this.store.simulation.answers.all,
      "menage",
      "statut_occupation_logement"
    )
    const logementVariables =
      Logement.getLogementVariables(logementStatut) || {}
    return {
      locataireTypesQuestion: {
        label: "Quel type de logement louez-vous ?",
        selectedValue: logementVariables.type || null,
        responses: [
          {
            label: "Non meublé",
            value: "nonmeuble",
          },
          {
            label: "Meublé / Hôtel",
            value: "meublehotel",
          },
          {
            label: "Foyer",
            value: "foyer",
            hint: ["foyer de jeune travailleur", "résidence sociale…"]
              .filter((present) => present)
              .join(", "),
          },
        ],
      },
    }
  },
  methods: {
    updateError(message, submit) {
      if (submit) {
        this.store.updateError(message)
      }
    },
    canSubmit(submit) {
      if (!this.locataireTypesQuestion.selectedValue) {
        this.updateError("Ce champ est obligatoire.", submit)
        return false
      } else {
        return true
      }
    },
    onSubmit() {
      if (this.canSubmit(true)) {
        console.log("onSubmit logement type")
        this.store.answer({
          entityName: "menage",
          fieldName: "statut_occupation_logement",
          value: Logement.getStatutOccupationLogement({
            type: "locataire",
            primoAccedant: false,
            locationType: this.locataireTypesQuestion.selectedValue,
          }),
        })
        this.$push()
      }
    },
  },
}
</script>
  
  <style scoped lang="scss">
fieldset {
  margin-bottom: 2em;
}
</style>
  
