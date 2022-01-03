<template>
  <div class="container">
    <h1>Des lieux d'accueil et d'accompagnement près de chez vous</h1>
    <p>
      Vous pouvez y être accompagné·e pour faire votre demande et poser toutes
      vos questions.
    </p>
    <p v-show="updating">
      <i class="fa fa-spinner fa-spin" aria-hidden="true" /> Récupération en
      cours…
    </p>
    <div v-if="list && list.length">
      <div v-for="(etablissement, index) in list" :key="index">
        <Etablissement :etablissement="etablissement" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"

import Etablissement from "@/components/Etablissement"
import EtablissementLib from "@/lib/etablissement"

export default {
  name: "LieuxDetails",
  components: {
    Etablissement,
  },
  data: function () {
    return {
      list: [],
      updating: true,
    }
  },
  mounted: function () {
    const commune = this.$route.params.commune
    const type = this.$route.params.type
    axios
      .get(
        `https://etablissements-publics.api.gouv.fr/v3/communes/${commune}/${type}`
      )
      .then(
        function (response) {
          return response.data.features
        },
        function () {
          return []
        }
      )
      .then(function (etablissements) {
        return etablissements.map(EtablissementLib.normalize)
      })
      .then((o) => {
        this.list = o
      })
      .finally(() => {
        this.updating = false
      })
  },
}
</script>
