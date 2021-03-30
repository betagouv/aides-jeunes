<template>
  <div class="container">
    <div class="frame-foyer">
      <IndividuForm v-bind:value="individu" v-bind:existingIndividu="true" v-on:input="emit" />
    </div>
  </div>
</template>

<script>
import IndividuForm from '@/components/IndividuForm'

export default {
  name: 'enfants.modifier',
  components: {
    IndividuForm
  },
  computed: {
    individu: function() {
      return this.$store.state.situation.enfants.find(enfant => enfant.id === this.$route.params.id)
    }
  },
  methods: {
    emit: function(individu) {
      this.$store.dispatch('updateIndividu', individu)
      this.$push()
    }
  }
}
</script>

<style scoped lang="css">
</style>
