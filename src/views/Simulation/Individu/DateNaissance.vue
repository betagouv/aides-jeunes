<template>
  <form @submit.prevent='onSubmit'>
    <label>
      <h1>{{ role === 'demandeur' ? 
        `Quelle est votre date de naissance&nbsp;?` :
        `Quelle est la date de naissance ${getLabel('nom')}&nbsp;?`}}</h1>
      <InputDate required id="date_naissance" v-model="value" />
      <p class="notification warning" v-if="error">
        Ce champ est obligatoire.
      </p>
    </label>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form >
</template>

<script>
import Actions from '@/components/Actions'
import InputDate from '@/components/InputDate'
import { createIndividuMixin } from '@/mixins/IndividuMixin'

export default {
  name: 'SimulationIndividuDateNaissance',
  components: {
    Actions,
    InputDate,
  },
  mixins: [createIndividuMixin('date_naissance', true)],
}
</script>
