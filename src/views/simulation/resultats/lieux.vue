<template>
  <div>
    <BackButton class="fr-mb-2w" size="small" @click="goToBenefitDetail()"
      >Retour à l'aide
    </BackButton>
    <p class="fr-text--lg">
      Vous pouvez y être accompagné ou accompagnée pour faire votre demande et
      poser toutes vos questions.
    </p>
    <p v-show="updating">
      <span
        class="fr-icon--ml fr-icon-refresh-line fr-icon-spin"
        aria-hidden="true"
      ></span
      ><span class="fr-ml-2w">Récupération en cours…</span>
    </p>
    <div v-if="list?.length">
      <div v-for="(etablissement, index) in list" :key="index">
        <Etablissement :etablissement="etablissement" />
      </div>
    </div>
    <div v-else>
      <router-link to="/simulation/resultats">
        <BackButton class="fr-mb-4w" size="small"
          >Revenir aux résultats
        </BackButton>
      </router-link>
    </div>
  </div>
</template>

<script>
import Etablissement from "@/components/etablissement.vue"
import {
  getBenefitEtablissements,
  getEtablissements,
} from "@lib/benefits/etablissements"
import BackButton from "@/components/buttons/back-button.vue"
import { useStore } from "@/stores/index.ts"
import ResultatsMixin from "@/mixins/resultats.js"

export default {
  name: "Lieux",
  components: {
    BackButton,
    Etablissement,
  },
  mixins: [ResultatsMixin],
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
    const benefits = this.eligibleBenefits()
    this.benefit = benefits.find(
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
