<template>
  <div class="aj-simulation">
    <article class="container aj-layout-container">
      <div class="aj-main-container">
        <div class="aj-category-title-wrapper">
          <div class="aj-category-title">
            <h1>Détail de l'aide</h1>
          </div>
        </div>
        <div class="aj-box-wrapper">
          <div class="aj-box aj-results-details">
            <DroitsDetails
              :droit="benefit"
              :droits="[benefit]"
              :city="'75056'"
              :patrimoine-captured="true"
              :ressources-year-minus-two-captured="true"
            />
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import Institution from "@/lib/institution"
import DroitsDetails from "@/components/droits-details.vue"

export default {
  name: "AideDetails",
  components: {
    DroitsDetails,
  },
  data() {
    return {}
  },
  computed: {
    benefitId() {
      return this.$route.params.benefitId
    },
    benefit() {
      const benefits = Institution.benefits.benefitsMap
      return benefits[this.benefitId]
    },
  },
}
</script>

<style scoped>
.aj-simulation {
  background-color: #f2f5f9;
}
</style>
