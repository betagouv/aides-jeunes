<template>
  <div class="container">
    <RessourceTypes v-bind:individu="individu" />
  </div>
</template>

<script>
import RessourceTypes from '@/components/Ressource/Types'
import Individu from '@/lib/Individu'

export default {
  name: 'ressources-types',
  components: {
    RessourceTypes,
  },
  data: function() {
    let situation = this.$SituationService.restoreLocal()
    let individu = Individu.find(situation.individus, this.$route.params.role, this.$route.params.id)

    return {
      individu,
    }
  },
  watch: {
    $route(to) {
      let situation = this.$SituationService.restoreLocal()
      this.individu = Individu.find(situation.individus, to.params.role, to.params.id)
    }
  }
}
</script>
