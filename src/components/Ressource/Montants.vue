<template>
  <fieldset class="form__group" v-bind:key="type.meta.id">
    <legend><h2>{{ type.meta.label }}</h2></legend>
    <YesNoQuestion class="form__group" v-model="type.displayMonthly">
      Percevez-vous le même montant tous les mois&nbsp;?
    </YesNoQuestion>
    <label class="form__group" v-if="type.displayMonthly">
      Indiquez {{ type.displayMonthly ? "le montant que vous percevez chaque mois" : "les montants que vous avez perçus en" }} :
      <input type="number" v-model.number="type.montants[dates.thisMonth.id]" v-if="type.displayMonthly==true"/>
    </label>
    <div class="form__group" v-if="type.displayMonthly == false">
      <div v-for="(month, index) in type.months" v-bind:key="month.id">
        <label>{{ month.label | capitalize }}</label>
        <input type="number" v-model.number="type.montants[month.id]" v-on:input="autofill($event.target.value, index, type)">
      </div>
    </div>
  </fieldset>
</template>

<script>
import YesNoQuestion from '@/components/YesNoQuestion'

export default {
  name: 'RessourceMontants',
  props: {
    type: Object
  },
  components: {
    YesNoQuestion
  },
  methods: {
    autofill: function(newValue, monthIndex, type) {
      const nextMonths = type.months.slice(monthIndex+1)
      nextMonths.forEach(m => type.montants[m.id] = newValue)
    }
  }
}
</script>
