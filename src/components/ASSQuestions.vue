<template>
  <div>
    <div class="form__group">
      <label for="mois-fin-contrat">
        Quand s’est terminé
        {{ individu._role == "demandeur" ? "votre" : "son" }} dernier contrat de
        travail ? (MM/AAAA)
      </label>
      <InputMonth
        id="mois-fin-contrat"
        :value="individu.date_debut_chomage"
        @input="$emit('updateDate', $event)"
      />
      <div>
        {{
          individu._role == "demandeur" ? "Si vous n'avez" : "S'il ou elle n'a"
        }}
        jamais eu de contrat de travail, laissez ce champ vide.
      </div>
    </div>

    <div class="form__group">
      <YesNoQuestion
        v-if="capturePreconditionAss"
        :value="individu.ass_precondition_remplie"
        @input="$emit('updateAssPrecondition', $event)"
      >
        {{ individu._role == "demandeur" ? "Avez-vous" : "A-t-il/elle" }}
        travaillé
        <abbr
          title="1825 jours (5 fois 365) couverts par un contrat de travail, en activité ou en congés."
          >au moins 5 ans</abbr
        >
        entre {{ yearsAgo(10) }} et {{ yearsAgo(0) }} ?
      </YesNoQuestion>
    </div>
  </div>
</template>

<script>
import YesNoQuestion from "@/components/YesNoQuestion"
import InputMonth from "@/components/InputMonth"
import { yearsAgo } from "@/lib/Utils"

export default {
  name: "ASSQuestions",
  components: {
    InputMonth,
    YesNoQuestion,
  },
  props: {
    individu: Object,
  },
  computed: {
    capturePreconditionAss: function () {
      let dt = moment(this.individu.date_debut_chomage)
      return this.individu.date_debut_chomage && dt.year && dt.year()
    },
  },
  methods: {
    yearsAgo: function (years) {
      return yearsAgo(years, this.individu.date_debut_chomage)
    },
  },
}
</script>
