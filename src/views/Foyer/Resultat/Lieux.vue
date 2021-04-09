<template>
  <div class="container">
    <p>
      Vous pouvez y être accompagné·e pour faire votre demande et poser toutes vos questions.
    </p>
    <p v-show="updating"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Récupération en cours…</p>
    <div v-if="list && list.length">
      <div v-for="(etablissement, index) in list" v-bind:key="index">
        <Etablissement v-bind:etablissement="etablissement"/>
        <router-link to="/simulation/resultats">
          <i class="fa fa-arrow-circle-left" aria-hidden="true"></i> Revenir aux résultats
        </router-link>
      </div>
    </div>
    <div v-else>
      <router-link to="/simulation/resultats">
        <i class="fa fa-arrow-circle-left" aria-hidden="true"></i> Revenir aux résultats
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import Institution from '@/lib/Institution'
import Etablissement from '@/components/Etablissement'
import EtablissementLib from '@/lib/Etablissement'

export default {
  name: 'lieux',
  components: {
    Etablissement,
  },
  data: function() {
    return {
      list: [],
      updating: true,
    }
  },
  mounted: function() {
    const city = this.$store.state.situation.menage.depcom
    let types = []
    Institution.forEachBenefit((benefit, benefitId, provider) => {
      if (provider.etablissements && provider.etablissements.length > 0 && benefitId === this.$route.params.id) {
        types = provider.etablissements
      }
    })
    axios.get(`https://etablissements-publics.api.gouv.fr/v3/communes/${city}/${types.join('+')}`)
      .then(function(response) { return response.data.features }, function() { return [] })
      .then(function(etablissements) {
        return etablissements.map(EtablissementLib.normalize)
      }).then(o => {
        this.list = o
      }).finally(() => {
        this.updating = false
      })
  }
}
</script>
