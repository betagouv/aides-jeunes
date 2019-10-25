<template>
  <div class="container">
    <RessourceTypes v-bind:individu="individu" />
  </div>
</template>

<script>
import RessourceTypes from '@/components/Ressource/Types'
import Individu from '@/lib/Individu'
import Ressource from '@/lib/Ressource'

export default {
  name: 'ressources-types',
  components: {
    RessourceTypes,
  },
  data: function() {
    let situation = this.$SituationService.restoreLocal()
    let individu = Individu.find(situation.individus, this.$route.params.role)
    // TODO enfants

    return {
      individu,
    }
  },
}
</script>
