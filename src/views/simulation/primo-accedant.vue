<template>
  <div>
    <form @submit.prevent="onSubmit">
      <fieldset>
        <legend>
          <h2 class="aj-question">
            {{ primoAccedantTypesQuestion.label
            }}<span v-if="primoAccedantTypesQuestion.hint" class="help">{{
              primoAccedantTypesQuestion.hint
            }}</span>
          </h2>
        </legend>
        <div class="aj-selections">
          <div
            v-for="logementType in primoAccedantTypesQuestion.responses"
            :key="logementType.value"
            class="aj-selection-wrapper"
          >
            <input
              :id="logementType.value"
              v-model="primoAccedantTypesQuestion.selectedValue"
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
    return {
      primoAccedantTypesQuestion: {
        label: "Êtes-vous primo-accédant pour cette propriété ?",
        selectedValue: logementStatut
          ? logementStatut === "primo_accedant"
            ? true
            : false
          : undefined,
        hint: "Un primo-accédant est une personne (ou un ménage) qui n’a pas été propriétaire de sa résidence principale dans les deux années qui viennent de s’écouler au moment où il achète son bien.",
        responses: [
          {
            label: "Oui",
            value: true,
            hint: null,
          },
          {
            label: "Non",
            value: false,
            hint: null,
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
      if (this.primoAccedantTypesQuestion.selectedValue === undefined) {
        this.updateError("Ce champ est obligatoire.", submit)
        return false
      } else {
        return true
      }
    },
    onSubmit() {
      if (this.canSubmit(true)) {
        this.store.answer({
          entityName: "menage",
          fieldName: "statut_occupation_logement",
          value: Logement.getStatutOccupationLogement({
            type: "proprietaire",
            primoAccedant: this.primoAccedantTypesQuestion.selectedValue,
            locationType: null,
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
