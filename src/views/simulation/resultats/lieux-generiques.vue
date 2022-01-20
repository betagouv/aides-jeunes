<template>
  <div class="aj-unbox">
    <router-link :to="{ name: 'resultats' }">
      <button
        class="aj-etablissements-back-button button outline small with-icon"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.25 5.24998H2.87249L6.53249 1.58998C6.82499 1.29748 6.82499 0.817478 6.53249 0.524978C6.23999 0.232478 5.76749 0.232478 5.47499 0.524978L0.532485 5.46748C0.239985 5.75998 0.239985 6.23248 0.532485 6.52498L5.47499 11.4675C5.76749 11.76 6.23999 11.76 6.53249 11.4675C6.82499 11.175 6.82499 10.7025 6.53249 10.41L2.87249 6.74998H11.25C11.6625 6.74998 12 6.41248 12 5.99998C12 5.58748 11.6625 5.24998 11.25 5.24998Z"
            fill="#030F8F"
          />
        </svg>
        Retour aux résultats
      </button>
    </router-link>

    <p v-show="updating">
      <i class="fa fa-spinner fa-spin" aria-hidden="true" /> Récupération en
      cours…
    </p>
    <div v-if="etablissements?.length">
      <p class="aj-etablissements-intro">
        Voici les lieux où vous pouvez y être accompagné(e) pour faire vos
        demandes et poser toutes vos questions.
      </p>

      <div
        v-for="(etablissement, index) in etablissements"
        :key="index"
        class="aj-etablissement-container"
      >
        <Etablissement :etablissement="etablissement" />
      </div>
    </div>
    <div v-else>
      <p class="aj-etablissements-intro" :v-if="error">
        {{ error }}
      </p>
      Revenir aux résultats
      <router-link to="/simulation/resultats">
        <i class="fa fa-arrow-circle-left" aria-hidden="true" />
      </router-link>
    </div>
  </div>
</template>

<script>
import Etablissement from "@/components/etablissement"
import Individu from "../../../../lib/individu.js"
import ResultatsMixin from "@/mixins/resultats"

const list = [
  {
    isRelevant: (demandeur, situation) => {
      let demandeurAge = Individu.age(demandeur, situation.dateDeValeur)

      return demandeurAge <= 25 && demandeurAge >= 16
    },
    types: ["mission_locale", "cij"],
  },
  {
    isRelevant: (demandeur) => {
      return demandeur.activite === "chomeur"
    },
    types: ["pole_emploi"],
  },
  {
    isRelevant: (demandeur) => {
      return demandeur.handicap
    },
    types: ["maison_handicapees"],
  },
  {
    // Les centres départements d'action sociale ont des noms différents en fonction des territoires
    types: ["cdas", "centre_social", "edas", "mds", "sdsei"],
  },
  {
    types: ["ccas", "mairie", "mairie_com", "msap"],
  },
]

export default {
  name: "LieuxGeneriques",
  components: {
    Etablissement,
  },
  mixins: [ResultatsMixin],
  data: function () {
    return {
      window,
    }
  },
  computed: {
    etablissements() {
      return this.$store.state.etablissementsSearch.list
    },
    updating() {
      return this.$store.state.etablissementsSearch.updating
    },
    error() {
      return this.$store.state.etablissementsSearch.error
    },
  },
  mounted() {
    if (!this.$store.getters.situation.menage.depcom) {
      this.restoreLatest()
      this.stopSubscription = this.$store.subscribe(({ type }) => {
        if (type === "reset") {
          this.loadEtablissements()
        }
      })
    } else {
      this.loadEtablissements()
    }
  },
  beforeUnmount: function () {
    this.stopSubscription?.()
  },
  methods: {
    getEtablissementsTypesBySituation() {
      let relevantTypes = []
      list.forEach((item) => {
        let isRelevant =
          !item.isRelevant ||
          item.isRelevant(
            this.$store.getters.situation.demandeur,
            this.$store.getters.situation
          )
        if (isRelevant) {
          relevantTypes = relevantTypes.concat(...item.types)
        }
      })
      return relevantTypes
    },
    loadEtablissements: function () {
      let typeEtablissements = this.getEtablissementsTypesBySituation()
      this.$store.dispatch("etablissementsSearch/get", {
        city: this.$store.getters.situation.menage.depcom,
        types: typeEtablissements,
      })
    },
  },
}
</script>
