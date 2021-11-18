<template>
  <form>
    <div>
      <router-link to="/simulation/resultats/">
        <h2 aria-label="Retour aux résultats">
          <i class="fa fa-arrow-circle-left" aria-hidden="true" /> Retour aux
          résultats
        </h2>
      </router-link>
    </div>

    <h3>Le montant indiqué pour {{ longLabel }} vous semble inexact&nbsp;?</h3>

    <component
      :is="resultatsInattendus[droit.id]"
      v-if="resultatsInattendus[droit.id]"
    />
    <ResultatInattenduYearMinusTwo v-else :droit="droit" />
  </form>
</template>

<script>
import Institution from "@/lib/institution"
import ResultatInattenduAideLogement from "@/components/resultat-inattendu/aide-logement"
import ResultatInattenduGarantieJeune from "@/components/resultat-inattendu/garantie-jeune"
import ResultatInattenduPpa from "@/components/resultat-inattendu/ppa"
import ResultatInattenduYearMinusTwo from "@/components/resultat-inattendu/year-minus-two"

const RESULTATS_INATTENDUS = {
  aide_logement: ResultatInattenduAideLogement,
  garantie_jeunes: ResultatInattenduGarantieJeune,
  ppa: ResultatInattenduPpa,
}

export default {
  name: "ResultatInattendu",
  components: {
    ResultatInattenduAideLogement,
    ResultatInattenduGarantieJeune,
    ResultatInattenduPpa,
    ResultatInattenduYearMinusTwo,
  },
  data: function () {
    let benefitKeyed = {}
    Institution.benefits.all.forEach((benefit) => {
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
