<template>
  <div class="aj-droit-header">
    <img class="aj-droit-illustration" :src="getBenefitImage(droit)" alt="" />

    <div class="aj-droit-identity">
      <h2 class="aj-question aj-benefit-label" itemprop="name">{{
        $filters.capitalize(droit.label)
      }}</h2>
      <div class="aj-institution-label">{{
        $filters.capitalize(droit.institution.label)
      }}</div>
    </div>

    <DroitEstime :droit="droit" />
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
