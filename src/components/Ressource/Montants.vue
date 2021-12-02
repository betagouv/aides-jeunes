<template>
  <div :key="type.meta.id" class="form__group">
    <h2 v-if="!withoutHeader">
      {{ type.meta.label }}
    </h2>
    <YesNoQuestion v-model="singleValue" class="form__group" html-heading="h3">
      <span
        v-html="
          getQuestionLabel(
            individu,
            type.meta,
            $store.state.dates.twelveMonthsAgo.label
          )
        "
      />
    </YesNoQuestion>

    <label v-if="type.displayMonthly === true" class="form__group">
      Indiquez le montant <b>mensuel net</b> :
      <InputNumber
        step="any"
        :value="type.amounts[$store.state.dates.thisMonth.id]"
        @input="$emit('update', 'singleValue', index, $event)"
      />
    </label>

    <div v-if="type.displayMonthly === false" class="form__group">
      <div>
        Indiquez les montants <strong>nets mensuels</strong> que
        {{ getLongLabel(individu, type.meta) }}
      </div>
      <div v-for="(month, monthIndex) in type.months" :key="month.id">
        <label>
          <MonthLabel :month="month" />
          <InputNumber
            :value="type.amounts[month.id]"
            @input="
              $emit('update', 'monthUpdate', index, {
                value: $event,
                monthIndex,
              })
            "
          />
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import MonthLabel from "@/components/MonthLabel"
import YesNoQuestion from "@/components/YesNoQuestion"
import Individu from "@/../lib/Individu"
import InputNumber from "@/components/InputNumber"

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
  computed: {
    singleValue: {
      get: function () {
        return this.type.displayMonthly
      },
      set: function (value) {
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
