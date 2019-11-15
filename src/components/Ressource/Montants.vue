<template>
  <fieldset class="form__group" v-bind:key="type.meta.id">
    <legend><h2 v-if="!withoutHeader">{{ type.meta.label }}</h2></legend>
    <YesNoQuestion class="form__group" v-model="singleValue">
      <span v-html="getQuestionLabel(individu, type.meta, dates.twelveMonthsAgo.label)" />
    </YesNoQuestion>

    <label class="form__group" v-if="singleValue">
      Indiquez le montant <b>mensuel net</b> :
      <input type="number" step="any" v-model.number="amounts[dates.thisMonth.id]" v-on:input="update($event.target.value, 0, true)"/>
    </label>

    <div class="form__group" v-if="singleValue === false">
      <div>{{ getLongLabel(individu, type.meta) }}</div>
      <div v-for="(month, index) in type.months" v-bind:key="month.id">
        <label>
          {{ month.label | capitalize }}
          <input type="number" v-model.number="amounts[month.id]" v-on:input="update($event.target.value, index)"/>
        </label>
      </div>
    </div>
  </fieldset>
</template>

<script>
import YesNoQuestion from '@/components/YesNoQuestion'
import Individu from '@/lib/Individu'

function getAmounts(type) {
  return type.months.reduce((r, m) => {
    r[m.id] = type.amounts[m.id]
    return r
  }, {})
}

function getQuestionLabel(individu, ressource, debutAnneeGlissante) {
  let verbForms = {
    pensions_alimentaires_versees_individu: 'versé',
    default: 'reçu'
  }

  let verb = verbForms[ressource.id] || verbForms.default;
  return `${['Le montant', verb, 'est-il le même <b>tous les mois</b> depuis', debutAnneeGlissante].join(' ')} ?`
}

function getLongLabel(individu, ressource) {
  const subject =Individu.label(individu)

  const auxForms = {
    demandeur: 'avez',
    default: 'a'
  }
  const aux = auxForms[individu.role] || auxForms.default

  const verbs = {
    pensions_alimentaires_versees_individu: 'versés',
    default: 'reçus'
  }
  const verb = verbs[ressource.id] || verbs.default

  return `${['Indiquez les montants que', subject, aux, verb, 'en'].join(' ')} :`
}

export default {
  name: 'RessourceMontants',
  props: {
    individu: Object,
    type: Object,
    withoutHeader: Boolean
  },
  computed: {
    singleValue: {
      get: function() {
        return this.type.displayMonthly
      },
      set: function(value) {
        this.type.displayMonthly = value
        if (this.type.displayMonthly) {
          this.update(this.amounts[this.type.months[0].id], 0, true)
        }
      }
    },
  },
  data: function() {
    return {
      amounts: getAmounts(this.type)
    }
  },
  components: {
    YesNoQuestion
  },
  methods: {
    getQuestionLabel,
    getLongLabel,
    update: function(newValue, monthIndex, force) {
      const oldValue = this.type.amounts[this.type.months[monthIndex].id]

      const nextMonths = this.type.months.slice(monthIndex)
      const valuesAreEqual = nextMonths.reduce((previousValuesAreEqual, m) => {
          return previousValuesAreEqual && this.type.amounts[m.id] === oldValue
        }, true)

      const shouldAutofill = valuesAreEqual || force

      if (shouldAutofill) {
        nextMonths.forEach(m => this.type.amounts[m.id] = newValue)
      } else {
        this.type.amounts[this.type.months[monthIndex].id] = newValue
      }

      this.amounts = getAmounts(this.type)
    }
  }
}
</script>
