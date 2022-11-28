<template>
  <form @submit.prevent="onSubmit" class="fr-form-group">
    <fieldset class="fr-fieldset">
      <legend class="fr-fieldset__legend">
        <span class="fr-text--lead">
          {{ logementTypesQuestion.label }}
        </span>
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-container fr-px-0">
          <div class="fr-grid-row">
            <div class="fr-col-12 fr-col-md-10 fr-col-lg-10">
              <div
                v-for="logementType in logementTypesQuestion.responses"
                :key="logementType.value"
                class="fr-radio-group fr-radio-rich"
              >
                <input
                  :id="logementType.value"
                  v-model="logementTypesQuestion.selectedValue"
                  :value="logementType.value"
                  name="logementType"
                  type="radio"
                />
                <label :for="logementType.value" class="fr-label">
                  <span
                    >{{ $filters.capitalize(logementType.label) }}
                    <i v-if="logementType.hint" class="fr-text--sm fr-ml-1w">{{
                      logementType.hint
                    }}</i></span
                  >
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </fieldset>

    <fieldset
      v-if="logementTypesQuestion.selectedValue == 'proprietaire'"
      class="fr-fieldset fr-mt-2w"
    >
      <legend class="fr-fieldset__legend">
        <span class="fr-text--lead">
          {{ primoAccedantQuestion.label }}
        </span>
        <span v-if="primoAccedantQuestion.hint" class="fr-hint-text">{{
          primoAccedantQuestion.hint
        }}</span>
      </legend>

      <div class="fr-fieldset__content">
        <div class="fr-container fr-px-0">
          <div class="fr-grid-row">
            <div class="fr-col-12 fr-col-md-10 fr-col-lg-10">
              <div
                v-for="response in primoAccedantQuestion.responses"
                :key="response.value"
                class="fr-radio-group fr-radio-rich"
              >
                <input
                  :id="response.label"
                  v-model="primoAccedantQuestion.selectedValue"
                  :name="primoAccedantQuestion.label"
                  :value="response.value"
                  type="radio"
                />
                <label :for="response.label" class="fr-label">
                  <span>{{ $filters.capitalize(response.label) }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </fieldset>

    <fieldset
      v-if="logementTypesQuestion.selectedValue == 'locataire'"
      class="fr-fieldset fr-mt-2w"
    >
      <legend class="fr-fieldset__legend">
        <span class="fr-text--lead">
          {{ locataireTypesQuestion.label }}
        </span>
      </legend>
      <div class="fr-fieldset__content">
        <div class="fr-container fr-px-0">
          <div class="fr-grid-row">
            <div class="fr-col-12 fr-col-md-10 fr-col-lg-10">
              <div
                v-for="response in locataireTypesQuestion.responses"
                :key="response.value"
                class="fr-radio-group fr-radio-rich"
              >
                <input
                  :id="response.value"
                  v-model="locataireTypesQuestion.selectedValue"
                  :name="logementTypesQuestion.label"
                  :value="response.value"
                  type="radio"
                />
                <label :for="response.value">
                  <span
                    >{{ $filters.capitalize(response.label) }}
                    <i v-if="response.hint" class="fr-text--sm fr-ml-1w">{{
                      response.hint
                    }}</i></span
                  >
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </fieldset>

    <ActionButtons :disableSubmit="!canSubmit(false)" :on-submit="onSubmit" />
  </form>
</template>

<script>
import ActionButtons from "@/components/action-buttons.vue"
import Logement from "@lib/logement"
import Individu from "@lib/individu"
import { getAnswer } from "@lib/answers"
import { useStore } from "@/stores"

export default {
  name: "SimulationLogement",
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
      logementTypesQuestion: {
        label: "Êtes-vous ?",
        selectedValue: logementVariables.type || null,
        responses: [
          {
            label: "Locataire",
            value: "locataire",
            hint: "figurant sur le bail, en foyer ou en résidence",
          },
          {
            label: "Propriétaire",
            value: "proprietaire",
            hint: "ou en location-accession",
          },
          {
            label: "Hébergé·e",
            value: "heberge",
            hint: "chez vos parents, chez un particulier ou en logement de fonction",
          },
          {
            label: "Sans domicile stable",
            value: "sansDomicile",
            hint: "ou domiciliation administrative",
          },
        ],
      },
      primoAccedantQuestion: {
        label: "Êtes-vous primo-accédant pour cette propriété ?",
        selectedValue: logementVariables.primoAccedant,
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
      locataireTypesQuestion: {
        label: "Quel type de logement louez-vous ?",
        selectedValue: logementVariables.locationType || null,
        hint: null,
        responses: [
          {
            label: "Non meublé",
            value: "nonmeuble",
            hint: null,
          },
          {
            label: "Meublé / Hôtel",
            value: "meublehotel",
            hint: null,
          },
          {
            label: "Foyer",
            value: "foyer",
            hint: [
              ...(this.store.situation.demandeur.activite == "etudiant"
                ? ["résidence universitaire", "logement CROUS"]
                : []),
              this.demandeurAge() > 50 ? "maison de retraite" : "",
              "foyer de jeune travailleur",
              "résidence sociale…",
            ]
              .filter((present) => present)
              .join(", "),
          },
        ],
      },
    }
  },
  methods: {
    demandeurAge() {
      return Individu.age(
        this.store.situation.demandeur,
        this.store.dates.today.value
      )
    },
    updateError(message, submit) {
      if (submit) {
        this.store.updateError(message)
      }
    },
    canSubmit(submit) {
      if (!this.logementTypesQuestion.selectedValue) {
        this.updateError("Ce champ est obligatoire.", submit)
      } else if (
        this.logementTypesQuestion.selectedValue === "proprietaire" &&
        this.primoAccedantQuestion.selectedValue === null
      ) {
        this.updateError("Le champ primo-accédant est obligatoire.", submit)
      } else if (
        this.logementTypesQuestion.selectedValue === "locataire" &&
        !this.locataireTypesQuestion.selectedValue
      ) {
        this.updateError("Le champ type de logement est obligatoire.", submit)
      } else {
        return true
      }
      return false
    },
    onSubmit() {
      if (this.canSubmit(true)) {
        this.store.answer({
          entityName: "menage",
          fieldName: "statut_occupation_logement",
          value: Logement.getStatutOccupationLogement({
            type: this.logementTypesQuestion.selectedValue,
            primoAccedant: this.primoAccedantQuestion.selectedValue,
            locationType: this.locataireTypesQuestion.selectedValue,
          }),
        })
        this.$push()
      }
    },
  },
}
</script>
