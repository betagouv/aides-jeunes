<template>
  <article>
    <h1 class="fr-mt-7w fr-mx-2w">Détail de l'aide</h1>
    <p>
      <router-link
        to="/aides"
        class="fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-btn--icon-left fr-icon-arrow-left-line"
        >Retour à la liste des aides</router-link
      >
    </p>
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

const route = useRoute()
const benefitId = route.params.benefitId
const benefit = getBenefit(benefitId)
</script>
