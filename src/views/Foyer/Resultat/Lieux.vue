<template>
  <div class="container">
    <p>
      Vous pouvez y être accompagné·e pour faire votre demande et poser toutes vos questions.
    </p>
    <p v-show="updating"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Récupération en cours…</p>
    <div v-if="list && list.length">
      <div v-for="(etablissement, index) in list" v-bind:key="index">
        <Etablissement v-bind:etablissement="etablissement"/>
        <router-link to="/foyer/resultat">
          <i class="fa fa-arrow-circle-left" aria-hidden="true"></i> Revenir aux résultats
        </router-link>
      </div>
    </div>
    <div v-else>
      <router-link to="/foyer/resultat">
        <i class="fa fa-arrow-circle-left" aria-hidden="true"></i> Revenir aux résultats
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'

import { forEach } from '@/../backend/lib/mes-aides'
import Etablissement from '@/components/Etablissement'

function normalizeEtablissement(etablissementFeature) {
    var etablissement = etablissementFeature.properties

    if (etablissement.url === 'https://www.maisondeservicesaupublic.fr') {
        delete etablissement.url
    }

    if (etablissement.horaires) {
        var mapping = {
            lundi: 1,
            mardi: 2,
            mercredi: 3,
            jeudi: 4,
            vendredi: 5,
            samedi: 6,
            dimanche: 7
        }
        etablissement.horaires = _.sortBy(etablissement.horaires, function(plage) {
            return mapping[plage.du]
        })
    }

    etablissement.adresse = _.find(etablissement.adresses, { type: 'physique' })
    if (! etablissement.adresse) {
        etablissement.adresse = _.find(etablissement.adresses, { type: 'géopostale' })
    }
    if (! etablissement.adresse) {
        etablissement.adresse = etablissement.adresses[0]
    }

    return etablissement
}

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
    var types = []
    forEach((benefit, benefitId, provider) => {
      if (provider.etablissements && provider.etablissements.length > 0 && benefitId === this.$route.params.id) {
        types = provider.etablissements
      }
    })
    axios.get(`https://etablissements-publics.api.gouv.fr/v3/communes/${city}/${types.join('+')}`)
      .then(function(response) { return response.data.features }, function() { return [] })
      .then(function(etablissements) {
        return etablissements.map(normalizeEtablissement)
      }).then(o => {
        this.list = o
      }).finally(() => {
        this.updating = false
      })
  }
}
</script>
