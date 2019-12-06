<template>
  <RessourceTypes v-bind:individu="individu" />
</template>

<script>
import RessourceTypes from '@/components/Ressource/Types'
import Individu from '@/lib/Individu'

export default {
  name: 'ressources-types',
  components: {
    RessourceTypes,
  },
  computed: {
    individu: function() {
      return Individu.find(this.$store.state.situation, this.$route.params.role, this.$route.params.id)
    }
  }
}
</script>
