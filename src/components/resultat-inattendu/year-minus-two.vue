<template>
  <div>
    <p v-if="!aCharge">
      Cette aide se base sur
      <strong>
        vos ressources de l'année
        {{ store.dates.fiscalYear.label }},
      </strong>
      que vous n'avez pas encore déclarées lors de cette simulation.
    </p>

    <p>
      <small
        >L'estimation que nous avons fait à partir de vos ressources sur les 12
        derniers mois est peut-être incorrecte.
      </small>
      <small v-if="!aCharge"
        >Vous pouvez améliorer les résultats affichés en indiquant vos
        ressources sur l'année {{ store.dates.fiscalYear.label }}.
      </small>
    </p>
    <p>
      <router-link
        v-if="!aCharge"
        class="fr-btn fr-btn--secondary"
        to="/simulation/ressources/fiscales"
      >
        Déclarez vos ressources
        {{ store.dates.fiscalYear.label }}
      </router-link>
    </p>
  </div>
</template>

<script lang="ts">
import SituationMethods from "@lib/situation.js"
import { useStore } from "@/stores/index.js"
export default {
  name: "ResultatInattenduYearMinusTwo",
  props: {
    droit: Object,
  },
  setup() {
    return {
      store: useStore(),
    }
  },
  computed: {
    aCharge() {
      return SituationMethods.aCharge(this.store.situation)
    },
  },
}
</script>
