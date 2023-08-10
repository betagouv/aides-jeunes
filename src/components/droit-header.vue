<template>
  <div class="aj-benefit-header fr-mb-4w">
    <img
      :src="getBenefitImage(droit)"
      class="aj-institution-icon"
      :alt="`Logo ${droit.institution.label}`"
    />
    <div class="aj-benefit-name">
      <h2 class="fr-text--lead" itemprop="name">{{
        $filters.capitalize(droit.label)
      }}</h2>
      <div class="aj-benefit-institution">{{
        $filters.capitalize(droit.institution.label)
      }}</div>
    </div>
    <DroitEstime :droit="droit" :show-unexpected="showUnexpected" />
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue"
import DroitEstime from "./droit-estime.vue"
import BenefitMixin from "@/mixins/benefit-image-mixin.js"
import { StandardBenefit } from "@data/types/benefits"

export default {
  name: "DroitHeader",
  components: {
    DroitEstime,
  },
  mixins: [BenefitMixin],
  props: {
    droit: { type: Object as PropType<StandardBenefit>, required: true },
    showUnexpected: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
