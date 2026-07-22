<script setup lang="ts">
import ContributionNavigation from "@/components/contribution-navigation.vue"
import BenefitsListView from "@/views/liste-aides.vue"
</script>

<template>
  <div class="fr-container fr-my-4w">
    <div class="fr-grid-row fr-grid-row--gutters">
      <aside class="fr-col-12 fr-col-lg-3">
        <ContributionNavigation />
      </aside>
      <div class="fr-col-12 fr-col-lg-9 fr-mt-n3w fr-ml-n3w">
        <BenefitsListView :show-simulation-buttons="false" />
      </div>
    </div>
  </div>
</template>
