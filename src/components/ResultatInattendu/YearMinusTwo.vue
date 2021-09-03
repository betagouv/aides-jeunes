<template>
  <div>
    <p
      >Cette aide se base sur
      <strong
        >vos ressources de l'année depuis
        {{ $store.state.dates.twelveMonthsAgo.label }}</strong
      >, que vous n'avez pas encore déclarées lors de cette simulation.</p
    >

    <p
      ><small
        >L'estimation que nous avons fait à partir de vos ressources sur les 12
        derniers mois est peut-être incorrecte. Vous pouvez améliorer les
        résultats affichés en indiquant vos ressources sur l'année
        {{ $store.state.dates.fiscalYear.label }}.</small
      ></p
    >

    <router-link
      class="button text-center"
      to="/simulation/individu/demandeur/ressources/types"
      >Déclarez vos ressources
      {{ $store.state.dates.fiscalYear.label }}</router-link
    >

    <router-link
      class="button-outline text-center primary"
      to="/simulation/resultats"
      >Retourner aux résultats</router-link
    >
  </div>
</template>

<script>
import FeedbackUtils from "@/mixins/FeedbackUtils"

export default {
  name: "ResultatInattenduYearMinusTwo",
  mixins: [FeedbackUtils],
  props: {
    droit: Object,
  },
}
</script>
