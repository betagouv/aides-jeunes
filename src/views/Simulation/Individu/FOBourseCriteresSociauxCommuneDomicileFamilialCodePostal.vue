<template>
<form @submit.prevent='onSubmit'>
    <label class="form__group" for="postal-code">Code postal de la commune de vos parents
        <input id="postal-code" v-model="demandeur.FO_bourse_criteres_sociaux_commune_domicile_familial_code_postal" v-on:input="fetchCommunes()">
        <p class="notification warning" v-if="displayPostalCodeWarning">
          Ce code postal est invalide
        </p>
      </label>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template>
      <script>
import Actions from '@/components/Actions'
import { createIndividuMixin } from '@/mixins/IndividuMixin'

export default {
  name: 'SimulationIndividuFOBourseCriteresSociauxCommuneDomicileFamilialCodePostal',
  components: {
    Actions,
  },
  mixins: [createIndividuMixin('FO_bourse_criteres_sociaux_commune_domicile_familial_code_postal')],
}
</script>
