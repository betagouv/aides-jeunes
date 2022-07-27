<template>
  <div class="aj-unbox">
    <BackButton
      class="aj-etablissements-back-button small"
      @click="goToBenefitDetail()"
      >Retour à l'aide</BackButton
    >
    <p class="aj-etablissements-intro">
      Vous pouvez y être accompagné·e pour faire votre demande et poser toutes
      vos questions.
    </p>
    <p v-show="updating">
      <i class="fa fa-spinner fa-spin" aria-hidden="true" /> Récupération en
      cours…
    </p>
    <div v-if="list?.length">
      <div
        v-for="(etablissement, index) in list"
        :key="index"
        class="aj-etablissement-container"
      >
        <Etablissement :etablissement="etablissement" />
      </div>
    </div>
    <div v-else>
      <router-link to="/simulation/resultats">
        <i class="fa fa-arrow-circle-left" aria-hidden="true" /> Revenir aux
        résultats
      </router-link>
    </div>
  </div>
</template>

<script>
import Institution from "@/../dist-server/lib/institution"
import Etablissement from "@/components/etablissement"
import {
  getBenefitEtablissements,
  getEtablissements,
} from "@/../lib/benefits/etablissements"
import BackButton from "@/components/buttons/back-button"

export default {
  name: "Lieux",
  components: {
    BackButton,
    Etablissement,
  },
  data: function () {
    return {
      benefit: null,
      list: [],
      updating: true,
      window,
    }
  },
  mounted: function () {
    const city = this.$store.getters.situation.menage.depcom
    this.benefit = Institution.benefits.all.find(
      (benefit) => benefit.id === this.$route.params.benefit_id
    )
    const types = getBenefitEtablissements(this.benefit)

    getEtablissements(city, types)
      .then((etablissements) => {
        this.list = etablissements
      })
      .finally(() => {
        this.updating = false
      })
  },
  methods: {
    goToBenefitDetail() {
      if (this.benefit?.id) {
        const path = `/simulation/resultats/${this.benefit.id}`
        this.$router.push(path)
      } else {
        window?.history.back()
      }
    },
  },
}
</script>
