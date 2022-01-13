<template>
  <div class="aj-droit-header">
    <img
      class="aj-droit-illustration"
      :src="require(`./../../public/img/${droit.institution.imgSrc}`)"
      :alt="`Image pour ${droit.label}`"
    />

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
import DroitEstime from "./droit-estime"

export default {
  name: "DroitHeader",
  components: {
    DroitEstime,
  },
  props: {
    droit: Object,
  },
}
</script>
