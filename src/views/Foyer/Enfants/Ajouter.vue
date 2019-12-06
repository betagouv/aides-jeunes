<template>
  <div class="frame-foyer">
    <IndividuForm v-model="individu" v-bind:existingIndividu="existingIndividu" v-on:input="emit" v-on:cancel="cancel" />
  </div>
</template>

<script>
import IndividuForm from '@/components/IndividuForm'
import Individu from '@/lib/Individu'

export default {
  name: 'enfants.ajouter',
  components: {
    IndividuForm
  },
  data () {
    let { existingIndividu, individu } = Individu.get(this.$store.state.situation.enfants, 'enfant', 1, this.$store.state.dates)

    return {
      existingIndividu,
      individu,
    }
  },
  methods: {
    cancel: function() {
      this.$router.push('/foyer/enfants')
    },
    emit: function() {
      this.$store.commit('addEnfant', this.individu)
      this.$push()
    }
  }
}
</script>

<style scoped lang="css">
</style>
