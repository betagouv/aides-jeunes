<template>
  <fieldset :key="type.meta.id" class="fr-fieldset fr-mb-4w">
    <legend class="fr-fieldset__legend">
      <span class="fr-text--lead">
        {{ type.meta.label }}
      </span>
    </legend>
    <div class="fr-fieldset__content">
      <YesNoQuestion
        v-model="singleValue"
        html-heading="h2"
        :id="`${type.meta.id}_question`"
      >
        <span
          v-html="
            getQuestionLabel(
              individu,
              type.meta,
              store.dates.twelveMonthsAgo.label
            )
          "
        />
      </YesNoQuestion>

      <div v-if="type.displayMonthly === true">
        <label :for="`${type.meta.id}_monthly`" class="fr-label">
          Indiquez le montant <b>mensuel net</b> :
        </label>
        <div class="fr-container--fluid">
          <div class="fr-grid-row">
            <div class="fr-col-12 fr-col-md-6 fr-col-lg-4">
              <InputNumber
                :value="type.amounts[store.dates.thisMonth.id]"
                :id="`${type.meta.id}_monthly`"
                @update:model-value="
                  $emit('update', 'singleValue', index, $event)
                "
              />
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="type.displayMonthly === false">
        <p>
          Indiquez les montants <strong>nets mensuels</strong> que
          {{ getLongLabel(individu, type.meta) }}
        </p>
        <div
          v-for="(month, monthIndex) in type.months"
          :key="month.id"
          class="fr-mt-1w"
        >
          <MonthLabel :for="`${type.meta.id}_${month.id}`" :month="month" />
          <div class="fr-container--fluid">
            <div class="fr-grid-row">
              <div class="fr-col-12 fr-col-md-6 fr-col-lg-4">
                <InputNumber
                  :id="`${type.meta.id}_${month.id}`"
                  :value="type.amounts[month.id]"
                  @update:model-value="
                    $emit('update', 'monthUpdate', index, {
                      value: $event,
                      monthIndex,
                    })
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </fieldset>
</template>

<script>
import MonthLabel from "@/components/month-label.vue"
import YesNoQuestion from "@/components/yes-no-question.vue"
import Individu from "@lib/individu"
import InputNumber from "@/components/input-number.vue"
import { useStore } from "@/stores"

function getQuestionLabel(individu, ressource, debutAnneeGlissante) {
  let verbForms = {
    pensions_alimentaires_versees_individu: "versé",
    default: "reçu",
  }

  let verb = verbForms[ressource.id] || verbForms.default
  return `${[
    "Le montant",
    verb,
    "est-il le même <b>tous les mois</b> depuis",
    debutAnneeGlissante,
  ].join(" ")} ?`
}

function getLongLabel(individu, ressource) {
  const subject = Individu.label(individu)

  const auxForms = {
    demandeur: "avez",
    default: "a",
  }
  const aux = auxForms[individu._role] || auxForms.default

  const verbs = {
    pensions_alimentaires_versees_individu: "versés",
    default: "reçus",
  }
  const verb = verbs[ressource.id] || verbs.default

  return `${[subject, aux, verb, "en"].join(" ")} :`
}

export default {
  name: "RessourceMontants",
  components: {
    InputNumber,
    MonthLabel,
    YesNoQuestion,
  },
  props: {
    individu: Object,
    type: Object,
    index: Number,
  },
  emits: ["update"],
  setup() {
    return {
      store: useStore(),
    }
  },
  computed: {
    singleValue: {
      get() {
        return this.type.displayMonthly
      },
      set(value) {
        this.$emit("update", "displayMonthly", this.index, value)
      },
    },
  },
  methods: {
    getQuestionLabel,
    getLongLabel,
  },
}
</script>
