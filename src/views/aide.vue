<template>
  <article class="fr-article">
    <h1>Détail de l'aide</h1>
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

<script>
import { getBenefit } from "@/lib/institution"
import DroitsDetails from "@/components/droits-details.vue"
import DroitsContributions from "@/components/droits-contributions.vue"

export default {
  name: "AideDetails",
  components: {
    DroitsDetails,
    DroitsContributions,
  },
  data() {
    return {}
  },
  computed: {
    benefitId() {
      return this.$route.params.benefitId
    },
    benefit() {
      return getBenefit(this.benefitId)
    },
  },
  methods: {
    goBack: function (event) {
      event.preventDefault()
      if (window?.history.length > 2) {
        history.back()
      } else {
        this.$router.push("/aides")
      }
    },
  },
}
</script>

<style scoped>
.aj-simulation {
  background-color: #f2f5f9;
}
</style>
