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
import { createIndividuMixin } from '@/mixins/IndividuMixin'

export default {
  name: 'SimulationIndividuHandicap',
  components: {
    Actions,
    YesNoQuestion
  },
  mixins: [createIndividuMixin('aah_restriction_substantielle_durable_acces_emploi')], 
}
</script>
