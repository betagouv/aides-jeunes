<template>
  <div class="container">
    <h1>Les ressources de vos enfants</h1>
    <YesNoQuestion class="form__group" v-model="enfant.hasRessources" v-for="enfant in enfants" v-bind:key="enfant.id">
        {{ enfant.firstName }} a-t-il·elle perçu des ressources <strong>depuis {{ dates.twelveMonthsAgo.label }}</strong> ?
    </YesNoQuestion>
    <div class="text-right">
      <button class="button large" v-on:click="next">Valider</button>
    </div>
  </div>
</template>

<script>
import Ressource from '@/lib/Ressource'
import Situation from '@/lib/Situation'
import YesNoQuestion from '@/components/YesNoQuestion'

export default {
  name: 'ressources-types',
  components: {
    YesNoQuestion,
  },
  data: function() {
    let situation = this.$SituationService.restoreLocal()
    let enfants = Situation.getEnfants(situation)

    enfants.forEach(e => e.hasRessources = e.hasRessources || false)
    return {
      enfants,
    }
  },
  methods: {
    next: function() {
      const { next } = this.enfants.reduce((accum, enfant) => {
        if (accum.next) {
          return accum
        }

        if (enfant.hasRessources) {
          accum.next = { name: 'ressources/types', params: { role: 'enfant', id: enfant.id } }
          return accum
        } else {
            var ressourceTypes = Ressource.getIndividuRessourceTypes(enfant)
            Object.keys(ressourceTypes).forEach(t => ressourceTypes[t] = false)
            Ressource.setIndividuRessourceTypes(enfant, ressourceTypes, this.dates)
        }

        accum.index = accum.index + 1
        return accum
      }, { next: undefined, index: 0 })
      this.$SituationService.saveLocal()

      this.$router.push(next || '/foyer/pensions-alimentaires')
    }
  }
}
</script>
