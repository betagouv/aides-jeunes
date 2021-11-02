<template>
  <div class="form__group" v-bind:key="type.meta.id">
    <h2 v-if="!withoutHeader">{{ type.meta.label }}</h2>
    <YesNoQuestion class="form__group" v-model="singleValue" html-heading="h3">
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

    <label class="form__group" v-if="type.displayMonthly === true">
      Indiquez le montant <b>mensuel net</b> :
      <InputNumber
        step="any"
        :value="type.amounts[$store.state.dates.thisMonth.id]"
        @input="$emit('update', 'singleValue', index, $event)"
      ></InputNumber>
    </label>

    <div class="form__group" v-if="type.displayMonthly === false">
      <div
        >Indiquez les montants <strong>nets mensuels</strong> que
        {{ getLongLabel(individu, type.meta) }}</div
      >
      <div v-for="(month, monthIndex) in type.months" v-bind:key="month.id">
        <label>
          <MonthLabel v-bind:month="month" />
          <InputNumber
            :value="type.amounts[month.id]"
            @input="
              $emit('update', 'monthUpdate', index, {
                value: $event,
                monthIndex,
              })
            "
          ></InputNumber>
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
  components: {
    InputNumber,
    MonthLabel,
    YesNoQuestion,
  },
  methods: {
    getQuestionLabel,
    getLongLabel,
  },
}
</script>
