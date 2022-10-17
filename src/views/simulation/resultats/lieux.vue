<template>
  <div class="aj-unbox">
    <BackButton
      class="aj-etablissements-back-button small"
      @click="goToBenefitDetail()"
      >Retour à l'aide
    </BackButton>
    <p class="aj-etablissements-intro">
      Vous pouvez y être accompagné·e pour faire votre demande et poser toutes
      vos questions.
    </p>
    <p v-show="updating">
      <i aria-hidden="true" class="ri ri-loader-2-line ri-spin ri-2x" />
      Récupération en cours…
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
        <i aria-hidden="true" class="ri ri-arrow-left-circle-fill" /> Revenir
        aux résultats
      </router-link>
    </div>
  </div>
</template>

<script>
import Institution from "@/lib/institution"
import Etablissement from "@/components/etablissement.vue"
import {
  getBenefitEtablissements,
  getEtablissements,
} from "@lib/benefits/etablissements"
import BackButton from "@/components/buttons/back-button.vue"
import { useStore } from "@/stores"

export default {
  name: "Lieux",
  components: {
    BackButton,
    Etablissement,
  },
  setup() {
    return { store: useStore() }
  },
  data() {
    return {
      benefit: null,
      list: [],
      updating: true,
      window,
    }
  },
  mounted() {
    const city = this.store.situation.menage.depcom
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
