<template>
  <div>
    <div class="form__group">
      <label>
        Quand s’est terminé {{ individu.role == 'demandeur' ? 'votre' : 'son' }} dernier contrat de travail ? (MM/AAAA)
        <InputMonth v-model="individu.date_debut_chomage" />
      </label>
      <div>
        {{ individu.role == 'demandeur' ? 'Si vous n\'avez' : 'S\'il ou elle n\'a' }} jamais eu de contrat de travail, laissez ce champ vide.
      </div>
    </div>

    <div class="form__group">
      <YesNoQuestion v-model="individu.ass_precondition_remplie"
        v-if="capturePreconditionAss"
        >
          {{ individu.role == 'demandeur' ? 'Avez-vous' : 'A-t-il/elle' }}
          travaillé <abbr title="1825 jours (5 fois 365) couverts par un contrat de travail, en activité ou en congés.">au moins 5 ans</abbr> entre {{ yearsAgo(10) }}
          et {{ yearsAgo(0) }} ?
      </YesNoQuestion>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

import YesNoQuestion from '@/components/YesNoQuestion'
import InputMonth from "@/components/InputMonth";

export default {
  name: 'ASSQuestions',
  components: {
    InputMonth,
    YesNoQuestion
  },
  props: {
    individu: Object
  },
  computed: {
    capturePreconditionAss: function() {
      let dt = moment(this.individu.date_debut_chomage)
      return this.individu.date_debut_chomage && dt.year && dt.year()
    }
  },
  methods: {
    yearsAgo: function(years) {
      let dt = moment(this.individu.date_debut_chomage)
      return this.individu.date_debut_chomage && dt.subtract(years, 'years').format('MMMM YYYY')
    }
  }
}
</script>
