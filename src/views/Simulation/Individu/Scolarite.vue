<template>
  <form @submit.prevent='onSubmit'>
    <h1>Où sera-t-il/elle scolarisé·e à la rentrée prochaine&nbsp;?</h1>
    <label v-for="scolarite in scolariteOptions" v-bind:key="scolarite.value">
    <input type="radio" name="scolarite" v-bind:value="scolarite.value" v-model="value"/>
    {{ scolarite.label }}
    </label>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import { createIndividuMixin } from '@/mixins/IndividuMixin'

const scolariteOptions = [
  {
      value: 'inconnue',
      label: 'Aucun des deux'
  },
  {
      value: 'college',
      label: 'Au collège'
  },
  {
      value: 'lycee',
      label: 'Au lycée / En CAP / En CPA'
  }
]
export default {
  name: 'SimulationIndividuScolarite',
  components: {
    Actions,
  },
  data: function() {
    return {
      scolariteOptions
    }
  },
  mixins: [createIndividuMixin('scolarite')],
}
</script>
