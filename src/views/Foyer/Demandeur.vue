<template>
  <IndividuForm without-title v-model="individu" v-bind:existingIndividu="existingIndividu" v-on:input="emit()" />
</template>

<script>
import IndividuForm from '@/components/IndividuForm'
import Individu from '@/lib/Individu'

export default {
  name: 'demandeur',
  components: {
    IndividuForm
  },
  data () {
    let existingIndividu = Boolean(this.$store.state.situation.demandeur)
    let individu = existingIndividu ? this.$store.state.situation.demandeur :  Individu.getDemandeur()

    return {
      existingIndividu,
      individu,
    }
  },
  methods: {
    emit: function() {
      this.$store.dispatch('updateIndividu', this.individu)
      this.$store.commit('clearMessage')
      this.$push()
    }
  }
}
</script>
