<template>
  <RessourceTypes v-bind:individu="individu" />
</template>

<script>
import RessourceTypes from '@/components/Ressource/Types'
import Individu from '@/lib/Individu'
import _ from 'lodash'

export default {
  name: 'ressources-types',
  components: {
    RessourceTypes,
  },
  computed: {
    individu: function() {
      return Individu.find(this.$store.state.situation, _.get(this.$route.params.id.split('_'), '0', this.$route.params.id), this.$route.params.id)
    }
  }
}
</script>
