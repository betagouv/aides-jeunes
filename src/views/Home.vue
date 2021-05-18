<template>
  <div id="homepage">
    <div class="container">
      <div class="aj-home-hero">
        <div class="aj-home-hero-content">
          <h1
            ><span class="hightlight"
              >Évaluez vos droits à<br />plus de 20 aides</span
            ><br />en moins de 5 minutes.</h1
          >
          <div class="aj-home-hero-buttons-wrapper">
            <button
              v-bind:class="`button ${ctaSize} secondary`"
              v-on:click="next()"
              v-analytics="{
                action: 'Reprendre ma simulation',
                category: 'Home',
              }"
              v-if="hasExistingSituation"
            >
              Reprendre ma simulation
            </button>
            <button
              v-bind:class="`button ${ctaSize} primary`"
              v-on:click="newSituation()"
              v-analytics="{ action: ctaLabel, category: 'Home' }"
            >
              {{ ctaLabel }}
            </button>
          </div>
        </div>
      </div>
      <div class="aj-home-illustration">
        <img src="@/assets/images/home_illustration.png" />
      </div>
    </div>
  </div>
</template>

<script>
import Institution from "../lib/Institution"
import reduce from "lodash/reduce"
import size from "lodash/size"
import filter from "lodash/filter"
import mapValues from "lodash/mapValues"

export default {
  name: "home",
  data: () => {
    let value = {}
    const types = ["prestationsNationales", "partenairesLocaux"]
    types.forEach(function (type) {
      let providersWithoutPrivatePrestations = mapValues(
        Institution[type],
        function (provider) {
          provider = { ...provider }
          provider.prestations = reduce(
            provider.prestations,
            function (prestations, prestation, name) {
              if (!prestation.private) {
                prestations[name] = prestation
              }

              return prestations
            },
            {}
          )
          return provider
        }
      )

      value[type] = filter(
        providersWithoutPrivatePrestations,
        function (provider) {
          return size(provider.prestations)
        }
      )
      value[type + "Count"] = Object.keys(value[type]).reduce(function (
        total,
        provider
      ) {
        return total + size(value[type][provider].prestations)
      },
      0)
    })

    value.showExperiment = Institution.experimentations.length

    return value
  },
  computed: {
    hasExistingSituation: function () {
      return this.$store.getters.passSanityCheck
    },
    ctaLabel: function () {
      return this.hasExistingSituation
        ? "Commencer une nouvelle simulation"
        : "Je commence"
    },
    ctaSize: function () {
      return this.hasExistingSituation ? "large" : "xlarge"
    },
  },
  methods: {
    newSituation: function () {
      this.$store.dispatch("clear", this.$route.query.external_id)
      this.next()
    },
    next: function () {
      this.$store.dispatch("verifyBenefitVariables")
      this.$push()
    },
  },
}
</script>
