<template>
  <form @submit.prevent='onSubmit'>
    <h1>Votre logement principal
    📝 Si vous habitez actuellement à l'étranger, préférez le simulateur Retour en France. Des délais de résidence en France sont en effet requis pour certaines aides.</h1>
    <fieldset>
      <label v-for="logementType in logementTypes" v-bind:key="logementType.id">
        <input type="radio" name="logementType" v-model="type" v-bind:value="logementType.id"
          />
          {{ logementType.label | capitalize }}
          <span class="help">{{ logementType.hint }}</span>
      </label>
    </fieldset>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form >
</template>

<script>
import Actions from '@/components/Actions'
import { logementTypes } from '@/constants/logement'

export default {
  name: 'SimulationLogement',
  components: {
    Actions,
  },
  data: function() {
    return {
      type: null,
      logementTypes
    }
  },
  methods: {
    onSubmit: function() {
      // this.$store.dispatch('updateMenage', {
      //   statut_occupation_logement: 'TODO'
      // })
      this.logement.statut_occupation_logement = this.type
      this.$push()
    }
  }
}
</script>
