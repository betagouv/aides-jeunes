<template>
  <fieldset class="form__group" v-bind:key="type.meta.id">
    <legend><h2 v-if="!withoutHeader">{{ type.meta.label }}</h2></legend>
    <YesNoQuestion class="form__group" v-model="singleValue">
      <span v-html="getQuestionLabel(individu, type.meta, $store.state.dates.twelveMonthsAgo.label)" />
    </YesNoQuestion>

    <label class="form__group" v-if="type.displayMonthly === true">
      Indiquez le montant <b>mensuel net</b> :
      <input type="number" v-select-on-click step="any"
        v-model.number="type.amounts[$store.state.dates.thisMonth.id]"
        v-on:input="$emit('update', 'singleValue', index, $event.target.value)"/>
    </label>

    <div class="form__group" v-if="type.displayMonthly === false">
      <div>{{ getLongLabel(individu, type.meta) }}</div>
      <div v-for="(month, monthIndex) in type.months" v-bind:key="month.id">
        <label>
          {{ month.label | capitalize }}
          <input type="number" v-select-on-click v-bind:value="type.amounts[month.id]"
          v-on:input="$emit('update', 'monthUpdate', index, { value: $event.target.value, monthIndex })"/>
        </label>
      </div>
    </div>
  </fieldset>
</template>

<script>
import YesNoQuestion from '@/components/YesNoQuestion'
import Individu from '@/lib/Individu'

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
    index: Number,
    withoutHeader: Boolean
  },
  computed: {
    singleValue: {
      get: function() {
        return this.type.displayMonthly
      },
      set: function(value) {
        this.$emit('update', 'displayMonthly', this.index, value)
      }
    }
  },
  components: {
    YesNoQuestion
  },
  methods: {
    getQuestionLabel,
    getLongLabel,
  }
}
</script>
