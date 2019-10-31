<template>
  <fieldset class="form__group" v-bind:key="type.meta.id">
    <h3>{{ type.meta.label }}</h3>
    <YesNoQuestion v-model="type.displayMonthly">
      Percevez-vous le même montant tous les mois ?
    </YesNoQuestion>
    <label v-if="type.displayMonthly!=undefined">
      Indiquez {{ type.displayMonthly ? "le montant que vous percevez chaque mois" : "les montants que vous avez perçu en" }} :
      <input type="number" v-model.number="type.montant.thisMonth" v-if="type.displayMonthly==true"/>
    </label>
    <div v-if="type.displayMonthly==false">
      <div v-for="(month, index) in type.months" v-bind:key="month.id">
        <label>{{ month.label | capitalize }}</label>
        <input type="number" v-model.number="type.montant[month.id]" v-on:input="autofill($event.target.value, index, type)">
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
      nextMonths.forEach(m => type.montant[m.id] = newValue)
    }
  }
}
</script>
