<template>
  <div :key="type.meta.id" class="fr-mb-4w">
    <h2 v-if="!withoutHeader" class="fr-text--lead fr-pr-3w">
      {{ type.meta.label }}
    </h2>
    <div class="fr-form-group">
      <YesNoQuestion v-model="singleValue" html-heading="h3">
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

      <label v-if="type.displayMonthly === true">
        Indiquez le montant <b>mensuel net</b> :
        <div class="fr-container--fluid">
          <div class="fr-grid-row">
            <div class="fr-col-12 fr-col-md-6 fr-col-lg-4">
              <InputNumber
                :value="type.amounts[store.dates.thisMonth.id]"
                @update:model-value="
                  $emit('update', 'singleValue', index, $event)
                "
              />
            </div>
          </div>
        </div>
      </label>

      <div v-if="type.displayMonthly === false">
        <div>
          Indiquez les montants <strong>nets mensuels</strong> que
          {{ getLongLabel(individu, type.meta) }}
        </div>
        <div v-for="(month, monthIndex) in type.months" :key="month.id">
          <MonthLabel :month="month" />
          <div class="fr-container--fluid">
            <div class="fr-grid-row">
              <div class="fr-col-12 fr-col-md-6 fr-col-lg-4">
                <InputNumber
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
  </div>
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
    withoutHeader: Boolean,
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
