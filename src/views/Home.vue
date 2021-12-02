<template>
  <div id="homepage">
    <div class="container">
      <div class="aj-home-hero">
        <div class="aj-home-hero-content">
          <h1>
            <span class="hightlight"
              >Évaluez vos droits à<br />plus de 20 aides
            </span>
            <br />en moins de 5 minutes.
          </h1>
          <div class="aj-home-hero-buttons-wrapper">
            <button
              v-if="hasExistingSituation"
              v-analytics="{
                action: 'Reprendre ma simulation',
                category: 'Home',
              }"
              :class="`button ${ctaSize} secondary`"
              @click="next()"
            >
              Reprendre ma simulation
            </button>
            <button
              v-analytics="{ action: ctaLabel, category: 'Home' }"
              :class="`button ${ctaSize} primary`"
              @click="newSituation()"
            >
              {{ ctaLabel }}
            </button>
          </div>
        </div>
      </div>
      <div class="aj-home-illustration">
        <img src="@/assets/images/home_illustration.png" alt="Portrait jeune" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
<<<<<<< HEAD
  name: "home",
=======
  name: "Home",
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

    return value
  },
>>>>>>> 32501319 (chore: eslint auto fix for Vue3)
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
      this.$store.dispatch("openFiscaParameters")
      this.$store.dispatch("verifyBenefitVariables")
      //FIXME: should be initiated with a default path
      this.$router.push("/simulation")
    },
  },
}
</script>
