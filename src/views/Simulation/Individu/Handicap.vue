<template>
  <form @submit.prevent='onSubmit'>
    <YesNoQuestion v-model="value">
      {{ getLabel('être') | capitalize }} en situation de handicap&nbsp;? <EnSavoirPlus/>
    </YesNoQuestion>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>

<script>
import Actions from '@/components/Actions'
import YesNoQuestion from '@/components/YesNoQuestion'
import { createIndividuMixin } from '@/mixins/IndividuMixin'
import EnSavoirPlus from "@/components/EnSavoirPlus"

export default {
  name: 'SimulationIndividuHandicap',
  components: {
    EnSavoirPlus,
    Actions,
    YesNoQuestion
  },
  computed: {
    hint() {
        return '"en situation de handicap"\n' +
      'c\'est ' + this.getLabel('possessive') + ' situation si vous avez déposé un dossier à la MDPH et que celle-ci ' + this.getLabel('avoirPasseSimple') + ' reconnu comme handicapé.' +
      ' La MDPH ' + this.getLabel('avoirPasseSimplePossesive') + ' également attribué un "taux d\'incapacité", lié à ' + this.getLabel('possesiveMasculin') + ' handicap. '
    }
  },
  mixins: [createIndividuMixin('handicap')],
}
</script>
