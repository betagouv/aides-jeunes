<template>
  <form @submit.prevent='onSubmit'>
    <legend>Où sera scolarisé·e {{individu._firstName}} à la rentrée prochaine&nbsp;?</legend>
    <template v-for="scolarite in scolariteOptions">
      <input :id="scolarite.value" type="radio" name="scolarite" v-bind:value="scolarite.value" v-model="value" v-bind:key="'input-' + scolarite.value"/>
      <label :for="scolarite.value" v-bind:key="'label-' + scolarite.value">{{ scolarite.label }}</label>
    </template>
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
