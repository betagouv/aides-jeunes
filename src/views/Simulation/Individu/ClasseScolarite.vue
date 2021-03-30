<template>
  <form @submit.prevent='onSubmit'>
    <fieldset>
    <legend><h2 class="aj-question">Dans quelle classe êtes-vous actuellement&nbsp;?
    </h2></legend>
    <div class="aj-selection-wrapper" v-for="scolarite in scolariteOptions" v-bind:key="scolarite.value">
      <input :id="scolarite.value" type="radio" name="scolarite" v-bind:value="scolarite.value" v-model="value" />
      <label :for="scolarite.value">{{ scolarite.label }}</label>
    </div>
    </fieldset>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import { createIndividuMixin } from '@/mixins/IndividuMixin'

export default {
  name: 'SimulationIndividuClassScolarite',
  components: {
    Actions,
  },
  data: function() {
    return {
      scolariteOptions: [{
        value: 'terminale',
        label: 'Terminale' 
      },{
        value: 'licence_3',
        label: 'Licence - 3ème année' 
      },{
        value: 'master_1',
        label: 'Master - 1ème année' 
      },{
        value: 'autre',
        label: 'Autre' 
      }]
    }
  },
  mixins: [createIndividuMixin('classe_scolarite')],
}
</script>
