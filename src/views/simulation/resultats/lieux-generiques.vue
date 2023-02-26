<template>
  <router-link :to="{ name: 'resultats' }">
    <BackButton class="fr-mb-4w" size="small">Retour aux résultats </BackButton>
  </router-link>

  <p v-show="updating">
    <span
      class="fr-icon--ml fr-icon-refresh-line fr-icon-spin"
      aria-hidden="true"
    ></span
    ><span class="fr-ml-2w">Récupération en cours…</span>
  </p>
  <div v-if="etablissements?.length">
    <p>
      Voici les lieux où vous pouvez y être accompagné(e) pour faire vos
      demandes et poser toutes vos questions.
    </p>

    <div v-for="(etablissement, index) in etablissements" :key="index">
      <Etablissement :etablissement="etablissement" />
    </div>
  </div>
  <div v-else>
    <p v-if="error">
      {{ error }}
    </p>
    <router-link :to="{ name: 'resultats' }">
      <BackButton class="fr-mb-4w" size="small"
        >Retour aux résultats
      </BackButton>
    </router-link>
  </div>
</template>

<script lang="ts">
import Etablissement from "@/components/etablissement.vue"
import Individu from "@lib/individu.js"
import ResultatsMixin from "@/mixins/resultats.js"
import BackButton from "@/components/buttons/back-button.vue"
import { useStore } from "@/stores/index.js"
import { useHelpingInstitutionStore } from "@/stores/helping-institution.js"
import { ActiviteType } from "@lib/enums/activite.js"

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
      return demandeur.activite === ActiviteType.chomeur
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
    BackButton,
    Etablissement,
  },
  mixins: [ResultatsMixin],
  setup() {
    return {
      store: useStore(),
      helpingInstitutionStore: useHelpingInstitutionStore(),
    }
  },
  data() {
    return {
      window,
    }
  },
  computed: {
    etablissements() {
      return this.helpingInstitutionStore.list
    },
    updating() {
      return this.helpingInstitutionStore.updating
    },
    error() {
      return this.helpingInstitutionStore.error
    },
  },
  mounted() {
    if (!this.store.situation.menage.depcom) {
      this.restoreLatest()
      this.stopSubscription = this.store.$onAction(({ after, name }) => {
        after(() => {
          if (name === "reset") {
            this.loadEtablissements()
          }
        })
      })
    } else {
      this.loadEtablissements()
    }
  },
  beforeUnmount() {
    this.stopSubscription?.()
  },
  methods: {
    getEtablissementsTypesBySituation() {
      let relevantTypes = []
      list.forEach((item) => {
        let isRelevant =
          !item.isRelevant ||
          item.isRelevant(this.store.situation.demandeur, this.store.situation)
        if (isRelevant) {
          relevantTypes = relevantTypes.concat(...item.types)
        }
      })
      return relevantTypes
    },
    loadEtablissements() {
      let typeEtablissements = this.getEtablissementsTypesBySituation()
      this.helpingInstitutionStore.get({
        city: this.store.situation.menage.depcom,
        types: typeEtablissements,
      })
    },
  },
}
</script>
