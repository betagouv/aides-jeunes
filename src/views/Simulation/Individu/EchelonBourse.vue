<template>
  <form @submit.prevent='onSubmit'>
    <h1>À quel échelon {{ role == 'demandeur' ? 'êtes-vous' : 'est-il/elle' }} boursier ?</h1>
    <input id="echelon-bourse" v-model="echelon_bourse" type="range" min="-1" max="7">
    {{ echelon_bourse == -1 ? 'Non boursier': 'Boursier échelon ' + echelon_bourse }}
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import Individu from '@/lib/Individu'

export default {
  name: 'SimulationIndividuEchelonBourse',
  components: {
    Actions,
  },
  data: function() {
    const id = this.$route.params.id
    const role = id.split('_')[0]
    const {individu} = Individu.get(this.$store.getters.peopleParentsFirst, role, this.$route.params.id, this.$store.state.dates)
    const echelon_bourse = individu.echelon_bourse
    return {
      individu,
      id,
      echelon_bourse,
      role
    }
  },
  methods: {
    onSubmit: function() {
      this.individu.echelon_bourse = this.echelon_bourse
      this.$store.dispatch('updateIndividu', this.individu)
      this.$push()
    }
  }
}
</script>
