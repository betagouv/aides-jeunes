<template>
  <p class="is-align-vertically-center">
    <a
      v-if="brokenLinkButtonState === 'show'"
      href="#"
      class="text-center"
      @click="alertBrokenLink($event)"
      >Lien invalide ?</a
    >
    <span
      v-else-if="brokenLinkButtonState === 'showThanksMessage'"
      class="text-center"
      >Merci pour votre aide ! Nous réglerons ce problème très
      prochainement.</span
    >
    <span v-if="showContributionLinks && isEditableBenefit()"
      > -
      <a
        :href="repositoryBenefitUrl()"
        target="_blank"
        rel="noreferrer"
        title="Code source de l'aide - Nouvelle fenêtre"
        >Code source de l'aide</a
      >
      -
      <a
        :href="netlifyContributionUrl()"
        target="_blank"
        rel="noreferrer"
        title="Proposer une modification : outil de contribution - Nouvelle fenêtre"
        >Proposer une modification</a
      ></span
    >
  </p>
</template>

<script>
export default {
  name: "DroitsContributions",
  props: {
    droit: Object,
    showContributionLinks: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      brokenLinkButtonState: "show",
    }
  },
  methods: {
    isEditableBenefit() {
      return ["javascript", "openfisca"].includes(this.droit.source)
    },
    repositoryBenefitUrl() {
      return `${process.env.VITE_BENEFIT_URL}/${this.droit.source}/${this.droit.id}.yml`
    },
    netlifyContributionUrl() {
      return `${process.env.VITE_NETLIFY_CONTRIBUTION_URL}/admin/#/collections/benefits_${this.droit.source}/entries/${this.droit.id}`
    },
    alertBrokenLink(event) {
      event.preventDefault()
      this.brokenLinkButtonState = "showThanksMessage"
      setTimeout(() => (this.brokenLinkButtonState = null), 5000)
      this.$matomo?.trackEvent(
        "General",
        "Erreur lien aide invalide",
        this.droit.label
      )
    },
  },
}
</script>
