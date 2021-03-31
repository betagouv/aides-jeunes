<template>
  <form @submit.prevent="next">
    <YesNoQuestion class="form__group" v-model="enfant._hasRessources" v-for="enfant in enfants" v-bind:key="enfant.id">
        {{ enfant._firstName | capitalize }} a-t-il·elle perçu des ressources <strong>depuis {{ $store.state.dates.twelveMonthsAgo.label }}</strong> ?
    </YesNoQuestion>
    <Actions v-bind:onSubmit='onSubmit'>
    </Actions>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import Ressource from '@/lib/Ressource'
import YesNoQuestion from '@/components/YesNoQuestion'

export default {
  name: 'ressources-types',
  components: {
    YesNoQuestion,
    Actions
  },
  data: function() {
    let enfants = this.$store.state.situation.enfants.map(e => Object.assign({}, e))

    enfants.forEach(e => e._hasRessources = e._hasRessources || undefined)
    return {
      enfants,
    }
  },
  methods: {
    onSubmit: function() {
      this.enfants.forEach(enfant => {
        if (! enfant._hasRessources) {
            let ressourceTypes = Ressource.getIndividuRessourceTypes(enfant)
            Object.keys(ressourceTypes).forEach(t => ressourceTypes[t] = false)
            Ressource.setIndividuRessourceTypes(enfant, ressourceTypes, this.$store.state.dates)
        }
        this.$store.dispatch('updateIndividu', enfant)
      })
      this.$push(this.$store.state.situation)
    }
  }
}
</script>
