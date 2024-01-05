<script setup lang="ts">
import { defineProps, computed } from "vue"
import { capitalize } from "@lib/utils.js"
import { uniq } from "lodash-es"

const props = defineProps({
  benefits: Object,
  label: String,
  logoPath: String,
  institutionLabel: String,
  description: String,
  redirectionPage: String,
})
const formattedInstitutionsLabel = computed(() => {
  const institutionLabels = uniq(
    props.benefits?.map((benefit: any) => benefit.institution.label)
  ).toString()
  return institutionLabels?.replace(/,/g, ", ")
})
</script>

<template>
  <div v-if="props.benefits" class="fr-ml-6v fr-mb-3w">
    <div class="fr-tile tile-1">
      <div class="fr-tile tile-2">
        <router-link
          class="fr-tile tile-3"
          :to="`/simulation/resultats/${props.redirectionPage}`"
          itemscope
          itemtype="http://schema.org/GovernmentService"
          data-testid="aides-bafa-preview"
          aria-label="Demander ces aides"
        >
          <div class="fr-p-4w">
            <div class="aj-benefit-header fr-mb-4w">
              <img
                class="aj-institution-icon"
                :src="props.logoPath"
                :alt="`Logo ${props.label}`"
              />
              <div class="aj-benefit-name">
                <h2 class="fr-text--lead" itemprop="name">{{
                  capitalize(props.label)
                }}</h2>
                <div class="aj-benefit-institution"
                  >{{ capitalize(formattedInstitutionsLabel) }}
                </div>
                <div>
                  <p class="fr-text--justify" v-html="props.description" />
                </div>
              </div>
            </div>
            <ul
              class="fr-btns-group fr-btns-group--inline-sm fr-btns-group--right"
            >
              <li>
                <router-link
                  :to="`/simulation/resultats/${props.redirectionPage}`"
                  class="fr-btn fr-my-0"
                  data-testid="aide-cta"
                >
                  Demander ces aides
                </router-link>
              </li>
            </ul>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tile-3:hover {
  background-color: white;
}

.tile-2,
.tile-3 {
  margin-right: 0.75rem;
  margin-top: 0.75rem;
  margin-bottom: -0.75rem;
  margin-left: -0.75rem;
}
</style>
