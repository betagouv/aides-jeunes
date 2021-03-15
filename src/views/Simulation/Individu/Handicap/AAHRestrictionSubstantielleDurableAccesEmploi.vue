<template>
  <form @submit.prevent='onSubmit'>
    <YesNoQuestion v-model="value">
      <h1>{{ role === 'demandeur' ? 'Avez-vous' : 'A-t-il/elle' }}
      une restriction substantielle et durable d'accès à l'emploi reconnue par la <abbr title="Commission des droits et de l'autonomie des personnes handicapées">CDAPH</abbr>&nbsp;?</h1>
    </YesNoQuestion>
    <p>Attention, cette restriction est différente de la reconnaissance de la qualité de travailleur handicapé.</p>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import YesNoQuestion from '@/components/YesNoQuestion'
import Individu from '@/lib/Individu'

export default {
  name: 'SimulationIndividuHandicap',
  components: {
    Actions,
    YesNoQuestion
  },
  data: function() {
    const id = this.$route.params.id
    const role = id.split('_')[0]
    const {individu} = Individu.get(this.$store.getters.peopleParentsFirst, role, this.$route.params.id, this.$store.state.dates)
    const value = individu.aah_restriction_substantielle_durable_acces_emploi
    return {
      individu,
      role,
      id,
      value,
    }
  },
  methods: {
    onSubmit: function() {
      this.individu.aah_restriction_substantielle_durable_acces_emploi = this.value
      this.$store.dispatch('updateIndividu', this.individu)
      this.$push()
    }
  }
}
</script>
