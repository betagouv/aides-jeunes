<template>
  <div>
    <p v-if="!aCharge">
      Cette aide se base sur
      <strong>
        vos ressources de l'année
        {{ $store.state.dates.fiscalYear.label }},
      </strong>
      que vous n'avez pas encore déclarées lors de cette simulation.
    </p>

    <p>
      <small
        >L'estimation que nous avons fait à partir de vos ressources sur les 12
        derniers mois est peut-être incorrecte.
      </small>
      <small v-if="!aCharge"
        >Vous pouvez améliorer les résultats affichés en indiquant vos
        ressources sur l'année {{ $store.state.dates.fiscalYear.label }}.
      </small>
    </p>

    <router-link
      v-if="!aCharge"
      class="button text-center"
      to="/simulation/ressources/fiscales"
    >
      Déclarez vos ressources
      {{ $store.state.dates.fiscalYear.label }}
    </router-link>

    <router-link
      class="button outline text-center back-button"
      to="/simulation/resultats"
    >
      Retourner aux résultats
    </router-link>
  </div>
</template>

<script>
import FeedbackUtils from "@/mixins/feedback-utils"
import Situation from "../../lib/situation"
export default {
  name: "ResultatInattenduYearMinusTwo",
  mixins: [FeedbackUtils],
  props: {
    droit: Object,
  },
  computed: {
    aCharge() {
      return Situation.aCharge(this.$store.getters.situation)
    },
  },
}
</script>

<style scoped>
.back-button {
  margin-top: 16px !important;
}
</style>
