<template>
  <form @submit.prevent='onSubmit'>
    <fieldset>
    <legend><h2 class="aj-question">Où sera scolarisé·e {{individu._firstName}} à la rentrée prochaine&nbsp;?
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
import { scolariteOptions } from '@/lib/Individu'

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
