<template>
  <form @submit.prevent='onSubmit'>
    <legend>{{ getLabel('avoir') | capitalize }} besoin d’une aide à la personne&nbsp;?</legend>
      <template v-for="gir in GIROptions">
        <input :id="gir.value" type="radio" name="gir" v-bind:value="gir.value" v-model="value" v-bind:key="gir.value"/>
        <label :for="gir.value" v-bind:key="gir.value">
            {{ gir.label }}
        </label>
      </template>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import { createIndividuMixin } from '@/mixins/IndividuMixin'

const GIROptions = [
    {
        value: 'gir_6',
        label: 'Jamais',
    },
    {
        value: 'gir_5',
        label: 'Ponctuellement',
    },
    {
        value: 'gir_1',
        label: 'Régulièrement'
    }
]

export default {
  name: 'SimulationIndividuGir',
  components: {
    Actions,
  },
  mixins: [createIndividuMixin('gir')],
  data: function() {
    return {
      GIROptions
    }
  },
}
</script>
