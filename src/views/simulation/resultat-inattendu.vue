<template>
  <form>
    <div>
      <BackButton
        class="fr-mb-4w"
        size="small"
        @click="$router.push({ path: '/simulation/resultats' })"
      >
        Revenir aux résultats
      </BackButton>
    </div>

    <h2>Le montant indiqué pour {{ longLabel }} vous semble inexact&nbsp;?</h2>

    <component
      :is="resultatsInattendus[droit.id]"
      v-if="resultatsInattendus[droit.id]"
    />
    <ResultatInattenduYearMinusTwo v-else :droit="droit" />
  </form>
</template>

<script lang="ts">
import Benefits from "@/lib/benefits.js"
import BackButton from "@/components/buttons/back-button.vue"
import ResultatInattenduAideLogement from "@/components/resultat-inattendu/aide-logement.vue"
import ResultatInattenduContratEngagementJeune from "@/components/resultat-inattendu/contrat-engagement-jeune.vue"
import ResultatInattenduPpa from "@/components/resultat-inattendu/ppa.vue"
import ResultatInattenduYearMinusTwo from "@/components/resultat-inattendu/year-minus-two.vue"

const RESULTATS_INATTENDUS = {
  aide_logement: ResultatInattenduAideLogement,
  contrat_engagement_jeune: ResultatInattenduContratEngagementJeune,
  ppa: ResultatInattenduPpa,
}

export default {
  name: "ResultatInattendu",
  components: {
    ResultatInattenduAideLogement,
    ResultatInattenduContratEngagementJeune,
    ResultatInattenduPpa,
    ResultatInattenduYearMinusTwo,
    BackButton,
  },
  data: function () {
    let benefitKeyed = {}
    Benefits.forEach((benefit) => {
      const benefit_temp = Object.assign(
        { type: benefit.institution.type },
        benefit
      )
      if (benefit_temp.label === "Tarification solidaire transports") {
        benefit_temp.label = `${benefit_temp.label} - ${benefit.institution.label}`
      }
      benefitKeyed[benefit_temp.id] = benefit_temp
    })

    return {
      benefitKeyed,
      resultatsInattendus: RESULTATS_INATTENDUS,
    }
  },
  computed: {
    droit: function () {
      return this.benefitKeyed[this.$route.params.id]
    },
    longLabel: function () {
      let prefix = `${this.droit.prefix}${
        this.droit.prefix?.endsWith("’") ? "" : " "
      }`
      return `${prefix}${this.droit.label}`
    },
  },
}
</script>
