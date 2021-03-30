<template>
  <form @submit.prevent='onSubmit'>
    <YesNoQuestion v-model="value">
      {{ getLabel('avoir') | capitalize }} prévu d'étudier <a href="">hors de votre académie</a> l'an prochain&nbsp;?
    </YesNoQuestion>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import YesNoQuestion from '@/components/YesNoQuestion'
import { createIndividuMixin } from '@/mixins/IndividuMixin'

export default {
  name: 'SimulationIndividuAideMobiliteParcoursupSortieAcademie',
  components: {
    Actions,
    YesNoQuestion
  },
  mixins: [createIndividuMixin('aide_mobilite_parcoursup_sortie_academie')],
}
</script>
