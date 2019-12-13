<template>
  <div>
    <p>Cette aide se base sur <strong>vos ressources de l'année {{ $store.state.dates.fiscalYear.label }}</strong>, que vous n'avez pas encore déclarées lors de cette simulation.</p>

    <p>L'estimation que nous avons fait à partir de vos ressources sur les 12 derniers mois est peut-être incorrecte. Vous pouvez améliorer les résultats affichés en indiquant vos ressources sur l'année {{ $store.state.dates.fiscalYear.label }}.</p>

    <router-link class="button text-center" to="/foyer/ressources/fiscales">Déclarez vos ressources {{ $store.state.dates.fiscalYear.label }}</router-link>

    <p>
      Vous pouvez à présent :
      <ul>
        <li>Retourner à la <router-link to="/foyer/resultat">page de résultats</router-link>.</li>
        <li>Nous contacter par email à <a v-mail="{to: 'feedback@mes-aides.gouv.fr', subject: emailSubject, body: emailBody}">feedback@mes-aides.gouv.fr</a>, en précisant votre numéro de simulation : <strong>{{ situation._id }}</strong></li>
      </ul>
    </p>
  </div>
</template>

<script>
import FeedbackUtils from '@/mixins/FeedbackUtils'

export default {
  name: 'ResultatInattenduYearMinusTwo',
  mixins: [FeedbackUtils],
  props: {
    droit: Object,
  },
}

</script>
