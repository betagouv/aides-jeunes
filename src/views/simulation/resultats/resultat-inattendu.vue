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

<script setup lang="ts">
import Benefits from "@/lib/benefits.js"
import BackButton from "@/components/buttons/back-button.vue"
import ResultatInattenduAideLogement from "@/components/resultat-inattendu/aide-logement.vue"
import ResultatInattenduContratEngagementJeune from "@/components/resultat-inattendu/contrat-engagement-jeune.vue"
import ResultatInattenduPpa from "@/components/resultat-inattendu/ppa.vue"
import ResultatInattenduYearMinusTwo from "@/components/resultat-inattendu/year-minus-two.vue"
import { ref, computed } from "vue"
import { useRoute } from "vue-router"

const RESULTATS_INATTENDUS = {
  aide_logement: ResultatInattenduAideLogement,
  contrat_engagement_jeune: ResultatInattenduContratEngagementJeune,
  ppa: ResultatInattenduPpa,
}

const route = useRoute()
const benefitKeyed = ref({})
const resultatsInattendus = RESULTATS_INATTENDUS

Benefits.forEach((benefit) => {
  const benefit_temp = Object.assign(
    { type: benefit.institution.type },
    benefit
  )
  if (benefit_temp.label === "Tarification solidaire transports") {
    benefit_temp.label = `${benefit_temp.label} - ${benefit.institution.label}`
  }
  benefitKeyed.value[benefit_temp.id] = benefit_temp
})

const droit = computed(() => {
  return benefitKeyed.value[route.params.id.toString()]
})

const longLabel = computed(() => {
  let prefix = `${droit.value.prefix}${
    droit.value.prefix?.endsWith("’") ? "" : " "
  }`
  return `${prefix}${droit.value.label}`
})
</script>
