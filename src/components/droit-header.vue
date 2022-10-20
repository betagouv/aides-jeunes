<template>
  <div class="fr-container fr-px-0 fr-mb-3w">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-1 fr-px-0">
        <img :src="getBenefitImage(droit)" class="aj-institution-icon" alt="" />
      </div>
      <div class="fr-col-8 fr-pl-3w">
        <h2 class="fr-tile__title" itemprop="name">{{
          $filters.capitalize(droit.label)
        }}</h2>
        <div class="fr-hint-text">{{
          $filters.capitalize(droit.institution.label)
        }}</div>
      </div>
      <div class="fr-col-3">
        <DroitEstime :droit="droit" />
      </div>
    </div>
  </div>
</template>

<script>
import DroitEstime from "./droit-estime.vue"
import BenefitMixin from "@/mixins/benefit-image-mixin"

export default {
  name: "DroitHeader",
  components: {
    DroitEstime,
  },
  mixins: [BenefitMixin],
  props: {
    droit: Object,
  },
}
</script>
