<template>
  <div class="container">
    <div class="frame-foyer">
      <h1>Nouvel enfant</h1>
      <IndividuForm v-model="individu" v-bind:date="situation.dateDeValeur" v-bind:existingIndividu="existingIndividu" v-on:input="emit()" />
    </div>
  </div>
</template>

<script>
import IndividuForm from '@/components/IndividuForm'
import Individu from '@/lib/Individu'
import Situation from '@/lib/Situation'

export default {
  name: 'enfants.ajouter',
  components: {
    IndividuForm
  },
  data () {
    let situation = this.$SituationService.restoreLocal()
    let enfants = Situation.getEnfants(situation)
    let { existingIndividu, individu } = Individu.get(enfants, 'enfant', 1)

    return {
      existingIndividu,
      individu,
      situation
    }
  },
  methods: {
    emit: function() {
      let enfants = Situation.getEnfants(this.situation)
      enfants.push(this.individu)
      Situation.setEnfants(this.situation, enfants)

      this.$SituationService.saveLocal()
      this.$router.push('/foyer/enfants')
    }
  }
}
</script>

<style scoped lang="css">
</style>
