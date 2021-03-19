<template>
  <form @submit.prevent='onSubmit'>
    <h1>{{getLabel('être') | capitalize}}&nbsp;?</h1>
    <label v-for="activite in ActiviteOptions" v-bind:key="activite.value">
    <input type="radio" name="activite" v-bind:value="activite.value" v-model="value"/>
    {{ activite.label }}
    </label>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import Individu from '@/lib/Individu'
import { createIndividuMixin } from '@/mixins/IndividuMixin'

export default {
  name: 'SimulationActivite',
  components: {
    Actions,
  },
  mixins: [createIndividuMixin('activite')],
  data: function() {
    const id = this.$route.params.id
    const role = id.split('_')[0]
    const {individu} = Individu.get(this.$store.getters.peopleParentsFirst, role, this.$route.params.id, this.$store.state.dates)
    let options = [
      {
        value: 'actif',
        label: 'En activité'
      },
      {
        value: 'chomeur',
        label: 'Inscrit·e comme demandeur d’emploi'
      },
      {
        value: 'etudiant',
        label: 'En formation'
      },
      {
        value: 'retraite',
        label: 'Retraité·e',
        isRelevant: individu => Individu.age(individu, this.$store.state.dates.today.value) > 30,
      },
      {
        value: 'inactif',
        label: 'Autre',
      },
    ]
    const ActiviteOptions = options.filter(o => (! o.isRelevant) || o.isRelevant(individu))
    return {
      ActiviteOptions,
    }
  },
}
</script>
