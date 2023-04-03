<template>
  <AnalyticRouterLink
    id="`cta-${type}`"
    :class="{
      'fr-btn fr-btn--secondary': level === 'default',
      'fr-btn': level === 'success',
    }"
    :aria-label="longLabel"
    :to="getURL(link)"
    :target="_blank"
    :rel="noopener"
    @click="onClick(link)"
  >
    {{ label }}
  </AnalyticRouterLink>
</template>

<script>
import ResultatsMixin from "@/mixins/resultats.js"
import StatisticsMixin from "@/mixins/statistics.js"
import { useStore } from "@/stores/index.ts"
import AnalyticRouterLink from "./buttons/analytic-router-link.vue"

let typeLabels = {
  teleservice: "Faire une demande en ligne",
  form: "Accéder au formulaire papier",
  instructions: "Accéder aux instructions",
  link: "Plus d'informations",
}

let longLabels = {
  ...typeLabels,
  link: "Plus d'informations",
}

export default {
  name: "BenefitCtaLink",
  components: {
    AnalyticRouterLink,
  },
  mixins: [ResultatsMixin, StatisticsMixin],
  props: {
    analyticsName: String,
    benefit: Object,
    level: String,
    type: String,
    link: [String, Object],
  },
  setup() {
    return {
      store: useStore(),
    }
  },
  data() {
    return {}
  },
  computed: {
    label() {
      return typeLabels[this.type]
    },
    longLabel() {
      return `${longLabels[this.type]} pour ${this.benefit.prefix || ""}${
        this.benefit.prefix?.endsWith("’") ? "" : " "
      }${this.benefit.label} - Nouvelle fenêtre`
    },
  },
  methods: {
    getURL(link) {
      if (typeof link === "object") {
        return this.$router.resolve(link).href
      }

      return link
    },
    onClick(link) {
      if (typeof link === "object") {
        window.localStorage.setItem(
          "trampoline",
          JSON.stringify({
            simulationId: this.store.calculs.resultats._id,
          })
        )
      }
    },
  },
}
</script>
