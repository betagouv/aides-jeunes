<template>
<form @submit.prevent='onSubmit'>
    <select
        v-model="demandeur.bourse_criteres_sociaux_commune_domicile_familial"
        id="commune">
        <option v-for="commune in communes" v-bind:value="commune.code" v-bind:key="commune.code">
            {{ commune.nom }}
        </option>
    </select>
    <Actions v-bind:onSubmit='onSubmit'/>
  </form>
</template> 
<script>

import Actions from '@/components/Actions'
import { createIndividuMixin } from '@/mixins/IndividuMixin'

export default {
  name: 'SimulationIndividuBourseCriteresSociauxCommuneDomicileFamilial',
  components: {
    Actions,
  },
  mixins: [createIndividuMixin('bourse_criteres_sociaux_commune_domicile_familial')],
}
</script>
