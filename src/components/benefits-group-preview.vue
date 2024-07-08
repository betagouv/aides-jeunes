<script setup lang="ts">
import { defineProps, computed, PropType } from "vue"
import { capitalize } from "@lib/utils.js"
import { uniq } from "lodash-es"
import { BenefitGroup } from "@data/types/benefits"

const props = defineProps({
  group: {
    type: Object as PropType<BenefitGroup>,
    required: true,
  },
})

const formattedInstitutionsLabel = computed(() => {
  return uniq(
    props.group.benefits?.map(({ institution }) => institution.label)
  ).join(", ")
})
</script>

<template>
  <div v-if="props.group.benefits" class="fr-ml-6v fr-mb-3w">
    <div class="fr-tile tile-1">
      <div class="fr-tile tile-2">
        <router-link
          class="fr-tile fr-tile--horizontal tile-3"
          :to="`/simulation/resultats/groupe/${props.group.id}`"
          itemscope
          itemtype="http://schema.org/GovernmentService"
          :data-testid="`${props.group.id}-preview`"
          aria-label="Demander ces aides"
        >
          <div class="fr-p-4w">
            <div class="aj-benefit-header fr-mb-4w">
              <img
                class="aj-institution-icon"
                :src="props.group.logoPath"
                :alt="`Logo ${props.group.label}`"
              />
              <div class="aj-benefit-name">
                <h2 class="fr-text--lead" itemprop="name">{{
                  capitalize(props.group.label)
                }}</h2>
                <div class="aj-benefit-institution"
                  >{{ capitalize(formattedInstitutionsLabel) }}
                </div>
                <div>
                  <p
                    class="fr-text--justify"
                    v-html="props.group.description"
                  />
                </div>
              </div>
              <div class="aj-benefit-amount"></div>
            </div>
            <ul
              class="fr-btns-group fr-btns-group--inline-sm fr-btns-group--right"
            >
              <li>
                <button class="fr-btn fr-my-0" data-testid="aide-cta">
                  Demander ces aides
                </button>
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

.fr-tile {
  /*override - padding: 2rem 2rem 2.25rem;*/
  padding: 0px;
}
</style>
