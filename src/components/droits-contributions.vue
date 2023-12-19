<template>
  <p class="fr-text--center">
    <span v-if="showContributionLinks && isEditableBenefit()"
      ><a
        :href="repositoryBenefitUrl()"
        target="_blank"
        rel="noreferrer"
        title="Code source de l'aide - Nouvelle fenêtre"
        >Code source de l'aide</a
      >
      <span v-if="netlifyContributionUrl()">
        -
        <a
          :href="netlifyContributionUrl()"
          target="_blank"
          rel="noreferrer"
          title="Proposer une modification : outil de contribution - Nouvelle fenêtre"
          >Proposer une modification</a
        >
      </span>
    </span>
  </p>
</template>

<script lang="ts">
const benefitsUrlPatterns = [
  {
    pattern: /-fsl-eligibilite$/,
    file: `${process.env.VITE_REPOSITORY_URL}/blob/main/data/benefits/dynamic/fsl.ts`,
  },
  {
    pattern: /-apa-eligibilite$/,
    file: `${process.env.VITE_REPOSITORY_URLl}/blob/main/data/benefits/dynamic/apa.ts`,
  },
  {
    pattern: /^aidesvelo_/,
    file: `https://github.com/mquandalle/mesaidesvelo/blob/main/src/aides.yaml`,
  },
]
export default {
  name: "DroitsContributions",
  props: {
    droit: Object,
    showContributionLinks: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    isEditableBenefit() {
      return ["javascript", "openfisca"].includes(this.droit.source)
    },
    repositoryBenefitUrl() {
      for (let category of benefitsUrlPatterns) {
        if (this.droit.id.match(category.pattern)) {
          return category.file
        }
      }
      return `${process.env.VITE_BENEFIT_URL}/${this.droit.source}/${this.droit.id}.yml`
    },
    netlifyContributionUrl() {
      for (let category of benefitsUrlPatterns) {
        if (this.droit.id.match(category.pattern)) {
          return
        }
      }
      return `${process.env.VITE_NETLIFY_CONTRIBUTION_URL}/admin/#/collections/benefits_${this.droit.source}/entries/${this.droit.id}`
    },
  },
}
</script>
