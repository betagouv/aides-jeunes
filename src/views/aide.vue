<template>
  <div class="droits-list">
    <div class="aj-aide-box a-unstyled">
      <img
        class="aj-aide-illustration"
        :src="require(`./../../public/img/${benefit.institution.imgSrc}`)"
        :alt="'Logo ' + benefit.institution.label"
      />

      <div class="aj-aide-text">
        <h2 class="aj-question aj-benefit-label">{{
          $filters.capitalize(benefit.label)
        }}</h2>
        <div class="aj-institution-label">{{
          $filters.capitalize(benefit.institution.label)
        }}</div>
        <p class="aj-aide-description" v-html="benefit.description" />
      </div>

      <div class="aj-droit-conditions">
        <p class="aj-droit-conditions-title"
          >Pour en bénéficier, il faut également :</p
        >
        <ul class="list-unstyled">
          <li v-for="(condition, index) in benefit.conditions" :key="index">
            <img src="@/assets/images/doigt.svg" />
            <span v-html="condition" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Institution from "@/lib/institution"

export default {
  name: "AidesDetails",
  components: {},
  data() {
    return {}
  },
  computed: {
    benefitId() {
      // eslint-disable-next-line no-debugger
      debugger
      return this.$route.params.benefitId
    },
    benefit() {
      const benefits = Institution.benefits.all
      const benefit = benefits.find((benefit) => benefit.id === this.benefitId)
      return benefit
    },
  },
}
</script>
