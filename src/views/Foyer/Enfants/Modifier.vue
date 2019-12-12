<template>
  <div class="container">
    <div class="frame-foyer">
      <IndividuForm v-model="individu" v-bind:existingIndividu="true" v-on:input="emit()" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import IndividuForm from '@/components/IndividuForm'

export default {
  name: 'enfants.modifier',
  components: {
    IndividuForm
  },
  data: function() {
    return {
      individu: _.find(this.$store.state.situation.enfants, { id: this.$route.params.id })
    }
  },
  methods: {
    emit: function() {
      this.$store.dispatch('updateIndividu', this.individu)
      this.$push()
    }
  }
}
</script>

<style scoped lang="css">
</style>
