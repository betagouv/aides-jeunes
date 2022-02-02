<template>
  <article class="text container aj-text-container">
    <h1>Détail de l'aide</h1>
    <div class="aj-box aj-results-details">
      <DroitsDetails
        :droit="benefit"
        :droits="[benefit]"
        :city="'75056'"
        :patrimoine-captured="true"
        :ressources-year-minus-two-captured="true"
      />
    </div>
  </article>
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

<style>
.aj-website-content {
  background-color: #f2f5f9;
}
.aj-text-container {
  margin: auto;
}
.aj-box {
  box-shadow: 0px 10px 20px rgb(0 0 0 / 10%);
  border-radius: var(--theme-border-radius);
  background-color: var(--white);
}
</style>
