<template>
  <article class="fr-article">
    <h1>Détail de l'aide</h1>
    <BackButton
      :to="route.query.from ? `/${route.query.from}` : '/aides'"
      size="small"
      as-link
      class="fr-mb-2w"
    >
      Retour à {{ getBackLabel() }}
    </BackButton>
    <DroitsDetails
      :droit="benefit"
      :droits="[benefit]"
      :city="'75056'"
      :patrimoine-captured="true"
      :ressources-year-minus-two-captured="true"
    />
    <DroitsContributions :droit="benefit" :show-contribution-links="true" />
  </article>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { getBenefit } from "@/lib/benefits.js"
import DroitsDetails from "@/components/droits-details.vue"
import DroitsContributions from "@/components/droits-contributions.vue"
import BackButton from "@/components/buttons/back-button.vue"

const route = useRoute()
const benefitId = route.params.benefitId as string
const benefit = getBenefit(benefitId)

const getBackLabel = () => {
  const from = route.query.from as string
  return from === "ville/lyon"
    ? "la liste des aides de la ville de Lyon"
    : "la liste des aides"
}
</script>
