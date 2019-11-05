<template>
  <fieldset class="form__group" v-bind:key="type.meta.id">
    <legend><h2>{{ type.meta.label }}</h2></legend>
    <YesNoQuestion class="form__group" v-model="singleValue">
      Percevez-vous le même montant tous les mois depuis {{ dates.twelveMonthsAgo.label }} ?
    </YesNoQuestion>
    <label class="form__group" v-if="singleValue">
      Indiquez le montant que vous percevez chaque mois :
      <input type="number" v-model.number="amounts[dates.thisMonth.id]" v-on:input="update($event.target.value, 0, true)"/>
    </label>
    <div class="form__group" v-if="singleValue === false">
      <div>Indiquez les montants que vous avez perçus en :</div>
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

function getAmounts(type) {
  return type.months.reduce((r, m) => {
    r[m.id] = type.amounts[m.id]
    return r
  }, {})
}

export default {
  name: 'RessourceMontants',
  props: {
    type: Object
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
